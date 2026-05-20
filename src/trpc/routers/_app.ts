import { agentsRouter } from "@/modules/agents/server/procedures";
import { meetingsRouter } from "@/modules/meetings/server/procedures";
import { homeRouter } from "@/modules/home/server/procedures";

import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  hello: homeRouter.hello,
  getStats: homeRouter.getStats,
  agents: agentsRouter,
  meetings: meetingsRouter,
});


export type AppRouter = typeof appRouter;