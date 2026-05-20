import { z } from "zod";
import { meetingStatus } from "@/db/schema";

export const meetingsInsertSchema = z.object({
  name: z.string().min(1, "Name is required"),
  agentId: z.string().min(1, "Agent is required"),
  instructions: z.string().optional(),
  status: z.enum(meetingStatus).default("scheduled"),
  startedAt: z.coerce.date().optional(),
  endedAt: z.coerce.date().optional(),
  transcriptUrl: z.string().url().optional().or(z.literal("")),
  summary: z.string().optional(),
  recordingUrl: z.string().url().optional().or(z.literal("")),
});

export const meetingsUpdateSchema = meetingsInsertSchema.partial().extend({
  id: z.string().min(1),
});
