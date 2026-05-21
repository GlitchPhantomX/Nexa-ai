import { db } from "@/db";
import { meetings, agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { meetingsInsertSchema, meetingsUpdateSchema } from "../schemas";
import { z } from "zod";
import { eq, and, desc, count, or, ilike, sql } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants";
import { meetingStatus as meetingStatusEnum } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const meetingsRouter = createTRPCRouter({
  getSession: protectedProcedure.query(async () => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  }),

  getToken: protectedProcedure.query(async ({ ctx }) => {
    const expiration = Math.floor(Date.now() / 1000) + 3600; // 1 hour
    const issuedAt = Math.floor(Date.now() / 1000) - 60; // 1 minute ago
    return streamVideo.generateUserToken({
      user_id: ctx.userId,
      exp: expiration,
      iat: issuedAt,
    });
  }),

  createCall: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [meeting] = await db
        .select()
        .from(meetings)
        .where(and(eq(meetings.id, input.id), eq(meetings.userId, ctx.userId)));

      if (!meeting) {
        throw new Error("Meeting not found");
      }

      const call = streamVideo.video.call("default", meeting.id);

      await call.getOrCreate({
        data: {
          created_by_id: ctx.userId,
          settings_override: {
            recording: {
              mode: "available",
              quality: "720p",
            },
            transcriptions: {
              mode: "available",
            },
          },
        },
      });

      if (meeting.status === "scheduled") {
        await db
          .update(meetings)
          .set({
            status: "ongoing",
            startedAt: new Date(),
          })
          .where(eq(meetings.id, meeting.id));
      }

      return {
        id: meeting.id,
        type: "default",
      };
    }),

  getRecordings: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const call = streamVideo.video.call("default", input.id);
      const { recordings } = await call.listRecordings();
      return recordings;
    }),

  getTranscriptions: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const call = streamVideo.video.call("default", input.id);
      const { transcriptions } = await call.listTranscriptions();
      return transcriptions;
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(DEFAULT_PAGE),
        pageSize: z.number().min(1).max(100).default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
        status: z.string().nullish(),
        agentId: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search, status, agentId } = input;
      const offset = (page - 1) * pageSize;

      const filters = [eq(meetings.userId, ctx.userId)];

      if (search && search.trim() !== "") {
        filters.push(ilike(meetings.name, `%${search}%`));
      }

      if (status && status !== "" && status !== "all") {
        // Only apply status filter if it's one of the valid statuses
        if (meetingStatusEnum.includes(status as any)) {
          filters.push(eq(meetings.status, status as any));
        }
      }

      if (agentId && agentId !== "" && agentId !== "all") {
        filters.push(eq(meetings.agentId, agentId));
      }

      const whereClause = and(...filters);

      const dataPromise = db
        .select({
          id: meetings.id,
          name: meetings.name,
          agentId: meetings.agentId,
          agentName: agents.name,
          status: meetings.status,
          startedAt: meetings.startedAt,
          endedAt: meetings.endedAt,
          duration: sql<number>`EXTRACT(EPOCH FROM (${meetings.endedAt} - ${meetings.startedAt})) / 60`,
          createdAt: meetings.createdAt,
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(whereClause)
        .orderBy(desc(meetings.createdAt))
        .limit(pageSize)
        .offset(offset);

      const countPromise = db
        .select({ total: count() })
        .from(meetings)
        .where(whereClause);

      const [data, [totalCount]] = await Promise.all([
        dataPromise,
        countPromise,
      ]);

      const total = totalCount.total;

      return {
        data,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const [meeting] = await db
        .select({
          id: meetings.id,
          name: meetings.name,
          agentId: meetings.agentId,
          agentName: agents.name,
          instructions: meetings.instructions,
          status: meetings.status,
          startedAt: meetings.startedAt,
          endedAt: meetings.endedAt,
          duration: sql<number>`EXTRACT(EPOCH FROM (${meetings.endedAt} - ${meetings.startedAt})) / 60`,
          transcriptUrl: meetings.transcriptUrl,
          summary: meetings.summary,
          recordingUrl: meetings.recordingUrl,
          createdAt: meetings.createdAt,
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(and(eq(meetings.id, input.id), eq(meetings.userId, ctx.userId)));

      return meeting || null;
    }),

  create: protectedProcedure
    .input(meetingsInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const [newMeeting] = await db
        .insert(meetings)
        .values({
          ...input,
          userId: ctx.userId,
        })
        .returning();
      return newMeeting;
    }),

  update: protectedProcedure
    .input(meetingsUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [updatedMeeting] = await db
        .update(meetings)
        .set(data)
        .where(and(eq(meetings.id, id), eq(meetings.userId, ctx.userId)))
        .returning();
      return updatedMeeting || null;
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [deletedMeeting] = await db
        .delete(meetings)
        .where(and(eq(meetings.id, input.id), eq(meetings.userId, ctx.userId)))
        .returning();
      return deletedMeeting || null;
    }),
});
