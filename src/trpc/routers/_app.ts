import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
 
export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
  getStats: baseProcedure.query(async () => {
    // Simulate DB fetch
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    return {
      totalMeetings: 24,
      aiAgentsActive: 3,
      usageLimit: 85,
      recentActivity: [
        { id: 1, type: "Meeting", title: "Product Sync", time: "2h ago" },
        { id: 2, type: "AI Agent", title: "Customer Support Bot", time: "5h ago" },
        { id: 3, type: "Meeting", title: "Q3 Planning", time: "Yesterday" },
      ]
    };
  }),
});
 
// export type definition of API
export type AppRouter = typeof appRouter;