import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

export const patientSchema = z.object({
  name: z.string().min(2),
  age: z.number().min(0).max(150),
  phone: z.string().min(10),
  address: z.string().optional(),
  gender: z.enum(['ذكر', 'أنثى']).optional(),
  email: z.string().email().optional()
});

export const doctorSchema = z.object({
  name: z.string().min(2),
  specialty: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().optional()
});