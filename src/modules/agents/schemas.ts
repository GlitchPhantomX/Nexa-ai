import { z } from "zod";

export const agentsInsertSchema = z.object({
  name: z.string().min(1, "Name is required"),
  instruction: z.string().min(1, "Instruction is required"),
  userId: z.string().min(1, "User ID is required"),
});
