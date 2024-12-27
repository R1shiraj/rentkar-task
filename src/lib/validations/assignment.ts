// src/lib/validations/assignment.ts
import { z } from 'zod';

export const assignmentSchema = z.object({
  orderId: z.string(),
  partnerId: z.string().optional(),
  timestamp: z.date().optional(),
  status: z.enum(['success', 'failed']),
  reason: z.string().optional()
});

export type AssignmentInput = z.infer<typeof assignmentSchema>;