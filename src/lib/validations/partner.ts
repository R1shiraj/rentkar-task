// src/lib/validations/partner.ts
import { z } from 'zod';

export const partnerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  status: z.enum(['active', 'inactive']),
  currentLoad: z.number().min(0).max(3),
  areas: z.array(z.string()),
  shift: z.object({
    start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
    end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)')
  }),
  metrics: z.object({
    rating: z.number().min(0).max(5).optional(),
    completedOrders: z.number().min(0).optional(),
    cancelledOrders: z.number().min(0).optional()
  })
});