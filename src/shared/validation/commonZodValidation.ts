import { z } from 'zod';

export const CreateFieldSchema = z.object({
  body: z.object({
    label: z.string().min(1, 'Label is required'),
    inputName: z.string().min(1, 'Input name is required'),
    inputType: z.enum([
      'text',
      'number',
      'boolean',
      'date',
      'enum',
      'email',
      'file',
    ]),
    required: z.boolean(),
    placeholder: z.string().optional(),
    options: z.array(z.string()).optional(),
    defaultValue: z.any().optional(),
    active: z.boolean().optional(),
  }),
});

export const UpdateFieldSchema = z.object({
  body: z.object({
    label: z.string().min(1, 'Label is required').optional(),
    inputName: z.string().min(1, 'Input name is required').optional(),
    inputType: z
      .enum(['text', 'number', 'boolean', 'date', 'enum', 'email', 'file'])
      .optional(),
    required: z.boolean().optional(),
    placeholder: z.string().optional(),
    options: z.array(z.string()).optional(),
    defaultValue: z.any().optional(),
    active: z.boolean().optional(),
  }),
});

// ✅ Type inference from schema (syncs with your interface)
export type TFieldInterface = z.infer<typeof CreateFieldSchema>;
