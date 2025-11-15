import { z } from 'zod';

const CreateLocationProfileSchema = z.object({
  body: z.object({
    locationProfileHubId: z.string().min(1, 'Location profile hub id is required'),
    locationName: z.string().min(1, 'Location name is required'),
    locationId: z.string().min(1, 'Location ID is required'),
    email: z.string().email('Invalid email format'),
    address: z.string().min(1, 'Address is required'),
    phoneNumber: z.string().min(1, 'Phone number is required'),
    currency: z.string().min(1, 'Currency is required'),
    excelFormula: z.string().min(1, 'Excel formula is required'),
  }),
});

const EditLocationProfileSchema = z.object({
  body: z.object({
    locationProfileHubId: z.string().min(1, 'Location profile hub id is required').optional(),
    locationName: z.string().min(1, 'Location name is required').optional(),
    locationId: z.string().min(1, 'Location ID is required').optional(),
    email: z.string().email('Invalid email format').optional(),
    address: z.string().min(1, 'Address is required').optional(),
    phoneNumber: z.string().min(1, 'Phone number is required').optional(),
    currency: z.string().min(1, 'Currency is required').optional(),
    excelFormula: z.string().min(1, 'Excel formula is required').optional(),
  }),
});

export const LocationProfileValidation = {
  CreateLocationProfileSchema,
  EditLocationProfileSchema,
};
