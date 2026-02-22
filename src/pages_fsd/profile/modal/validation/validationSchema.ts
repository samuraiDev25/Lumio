import { z } from 'zod';

export const generalInformationSchema = z.object({
  username: z
    .string()
    .min(6, 'Username must be at least 6 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers and underscores',
    ),

  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be at most 50 characters'),

  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be at most 50 characters'),
  dateOfBirth: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
      'Date must be in YYYY-MM-DD format',
    )
    .refine(
      (val) => !val || !isNaN(new Date(val).getTime()),
      'Please enter a valid date',
    )
    .refine(
      (val) => !val || new Date(val) < new Date(),
      'Date of birth cannot be in the future',
    )
    .refine(
      (val) => !val || new Date(val) > new Date('1900-01-01'),
      'Date of birth cannot be earlier than 1900',
    ),
  country: z.string().optional(),

  city: z.string().optional(),

  aboutMe: z
    .string()
    .max(200, 'About me must be at most 200 characters')
    .optional(),
});

export type GeneralInformationSchema = z.infer<typeof generalInformationSchema>;
