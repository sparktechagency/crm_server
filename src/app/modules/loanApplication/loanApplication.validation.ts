import { z } from 'zod';

const createLoanApplicationSchema = z.object({
  body: z.object({
    leadUid: z.string().min(1, { message: 'Lead UID is required' }).optional(),

    email: z.string().email({ message: 'Invalid email address' }).optional(),
    phoneNumber: z
      .string({ message: 'Phone number must be at least 10 digits' })
      .optional(),
    homeAddress: z
      .string()
      .min(5, { message: 'Home address is too short' })
      .optional(),
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters' })
      .optional(),

    applicantStatus: z.enum(['New', 'From Leads'], {
      message: "Applicant status must be 'New' or 'From Leads'",
    }),
    typeofFinancingRequested: z
      .string()
      .min(1, { message: 'Type of financing is required' }),
    purposeOfFinancing: z
      .string()
      .min(1, { message: 'Purpose of financing is required' }),
    loanAmountRequested: z
      .number()
      .positive({ message: 'Loan amount must be greater than 0' }),

    employmentStatus: z
      .string()
      .min(1, { message: 'Employment status is required' }),
    whereAreYouLocated: z.string().min(1, { message: 'Location is required' }),
    monthlyIncome: z
      .number()
      .nonnegative({ message: 'Monthly income cannot be negative' }),
    preferredContact: z
      .string()
      .min(1, { message: 'Preferred contact is required' }),
    term: z.string().min(1, { message: 'Term is required' }),
    nid: z
      .string()
      .min(5, { message: 'NID must be at least 5 characters' })
      .optional(),

    startDate: z.coerce.date({
      message: 'Start date is required and must be valid',
    }),
    endDate: z.coerce.date({
      message: 'End date is required and must be valid',
    }),
  }),
});

const updateLoanApplicationSchema = z.object({
  body: z.object({
    leadUid: z.string().min(1, { message: 'Lead UID is required' }).optional(),

    email: z.string().email({ message: 'Invalid email address' }).optional(),
    phoneNumber: z.string().optional(),
    homeAddress: z
      .string()
      .min(5, { message: 'Home address is too short' })
      .optional(),
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters' })
      .optional(),

    applicantStatus: z
      .enum(['New', 'From Leads'], {
        message: "Applicant status must be 'New' or 'From Leads'",
      })
      .optional(),
    typeofFinancingRequested: z
      .string()
      .min(1, { message: 'Type of financing is required' })
      .optional(),
    purposeOfFinancing: z
      .string()
      .min(1, { message: 'Purpose of financing is required' })
      .optional(),
    loanAmountRequested: z
      .number()
      .positive({ message: 'Loan amount must be greater than 0' })
      .optional(),

    employmentStatus: z
      .string()
      .min(1, { message: 'Employment status is required' })
      .optional(),
    whereAreYouLocated: z
      .string()
      .min(1, { message: 'Location is required' })
      .optional(),
    monthlyIncome: z
      .number()
      .nonnegative({ message: 'Monthly income cannot be negative' })
      .optional(),
    preferredContact: z
      .string()
      .min(1, { message: 'Preferred contact is required' })
      .optional(),
    term: z.string().min(1, { message: 'Term is required' }).optional(),
    nid: z
      .string()
      .min(5, { message: 'NID must be at least 5 characters' })
      .optional(),

    startDate: z.coerce
      .date({ message: 'Start date is required and must be valid' })
      .optional(),
    endDate: z.coerce
      .date({ message: 'End date is required and must be valid' })
      .optional(),
  }),
});

const loanApplicationActionSchema = z.object({
  body: z.object({
    loanId: z.string().min(1, { message: 'Loan ID is required' }),
    action: z.enum(['approved', 'rejected'], {
      message: "Action must be 'approved' or 'rejected'",
    }),
  }),
});

export const LoanApplicationValidation = {
  createLoanApplicationSchema,
  updateLoanApplicationSchema,
  loanApplicationActionSchema,
};
