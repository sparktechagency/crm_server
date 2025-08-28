import { z } from 'zod';

const createRepaymentsSchema = z.object({
  body: z.object({
    clientUid: z.string().min(1, { message: 'Client UID is required.' }),
    loanUid: z.string().min(1, { message: 'Loan UID is required.' }),
    month: z.enum([
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]),
    installmentAmount: z
      .number()
      .min(0, { message: 'Installment amount must be a positive number.' })
      .optional(),
  }),
});

export const RepaymentsValidation = {
  createRepaymentsSchema,
};
