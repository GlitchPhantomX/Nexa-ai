import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { agentsInsertSchema } from "../schemas";

export const agentsRouter = createTRPCRouter({
    getMany: baseProcedure.query(async () => {
       const data = await db.select().from(agents);
       return data;
    }),
    create: baseProcedure
        .input(agentsInsertSchema)
        .mutation(async ({ input }) => {
            const [newAgent] = await db.insert(agents).values({
                name: input.name,
                instruction: input.instruction,
                userId: input.userId,
            }).returning();
            return newAgent;
        }),
});