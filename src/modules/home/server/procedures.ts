import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { z } from "zod";
import { db } from "@/db";
import { meetings, agents } from "@/db/schema";
import { count, eq } from "drizzle-orm";

export const homeRouter = createTRPCRouter({
  hello: baseProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Welcome, ${input.text}`,
      };
    }),
  getStats: baseProcedure.query(async ({ ctx }) => {
    // If not logged in, return empty stats
    if (!(ctx as any).userId) {
      return {
        totalMeetings: 0,
        aiAgentsActive: 0,
        usageLimit: 0,
        recentActivity: [],
      };
    }

    const [meetingsCount] = await db
      .select({ total: count() })
      .from(meetings)
      .where(eq(meetings.userId, (ctx as any).userId));

    const [agentsCount] = await db
      .select({ total: count() })
      .from(agents)
      .where(eq(agents.userId, (ctx as any).userId));

    return {
      totalMeetings: meetingsCount.total,
      aiAgentsActive: agentsCount.total,
      usageLimit: Math.min(Math.round((agentsCount.total / 10) * 100), 100), // Mock usage limit
      recentActivity: [], // Could be fetched from a dedicated activity log table
    };
  }),
});
