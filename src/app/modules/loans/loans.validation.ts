import { z } from 'zod';

export const CreateLoanSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    features: z.array(z.string()).min(1, 'Features are required'),
  }),
});

// ✅ Type inference from schema (syncs with your interface)
export type TFieldInterface = z.infer<typeof CreateLoanSchema>;
