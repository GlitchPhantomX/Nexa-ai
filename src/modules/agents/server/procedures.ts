import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema } from "../schemas";
import { z } from "zod";
import { eq, sql, or, ilike, desc, count, and } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants";

export const agentsRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(DEFAULT_PAGE),
        pageSize: z.number().min(1).max(100).default(DEFAULT_PAGE_SIZE),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;
      const offset = (page - 1) * pageSize;

      const filters = [eq(agents.userId, ctx.userId)];

      if (search) {
        filters.push(
          or(
            ilike(agents.name, `%${search}%`),
            ilike(agents.instruction, `%${search}%`),
          )!,
        );
      }

      const whereClause = and(...filters);

      const dataPromise = db
        .select({
          id: agents.id,
          name: agents.name,
          userId: agents.userId,
          instruction: agents.instruction,
          createdAt: agents.createdAt,
          updatedAt: agents.updatedAt,
          meetingCount: sql<number>`count(${meetings.id})::int`,
        })
        .from(agents)
        .leftJoin(meetings, eq(agents.id, meetings.agentId))
        .where(whereClause)
        .groupBy(agents.id)
        .orderBy(desc(agents.createdAt))
        .limit(pageSize)
        .offset(offset);

      const countPromise = db
        .select({ total: count() })
        .from(agents)
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
  create: protectedProcedure
    .input(agentsInsertSchema.omit({ userId: true }))
    .mutation(async ({ ctx, input }) => {
      const [newAgent] = await db
        .insert(agents)
        .values({
          name: input.name,
          instruction: input.instruction,
          userId: ctx.userId,
        })
        .returning();
      return newAgent;
    }),
});
