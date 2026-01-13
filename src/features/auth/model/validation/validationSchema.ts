import { z } from 'zod';

const nameSchema = z
  .string()
  .min(6, { message: 'Minimum number of characters 6' })
  .max(30, { message: 'Maximum number of characters 30' })
  .regex(/^[a-zA-Z0-9_-]+$/, {
    message: 'Only letters, numbers, underscore, and hyphen are allowed',
  });

const emailSchema = z.email({
  message: 'The email must match the format example@example.com',
});

const passwordSchema = z
  .string()
  .min(6, { message: 'Minimum number of characters 6' })
  .max(20, { message: 'Maximum number of characters 20' })
  .regex(/[0-9]/, { message: 'Must contain at least one digit (0-9)' })
  .regex(/[A-Z]/, {
    message: 'Must contain at least one uppercase letter (A-Z)',
  })
  .regex(/[a-z]/, {
    message: 'Must contain at least one lowercase letter (a-z)',
  });

export const signUpSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    passwordConfirmation: passwordSchema,
    isAgree: z.boolean(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords must match',
    path: ['passwordConfirmation'],
  })
  .refine((data) => data.isAgree, {
    message: 'You’ll need to agree to proceed',
    path: ['isAgree'],
  });

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const newPasswordSchema = z
  .object({
    password: passwordSchema,
    passwordConfirmation: passwordSchema,
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords must match',
    path: ['passwordConfirmation'],
  });

export const recoveryPasswordSchema = z.object({
  email: emailSchema,
});

export const expiredLinkSchema = z.object({
  email: emailSchema,
});

export type SignInType = z.infer<typeof signInSchema>;
export type SignUpType = z.infer<typeof signUpSchema>;
export type NewPasswordType = z.infer<typeof newPasswordSchema>;
export type RecoveryPasswordType = z.infer<typeof recoveryPasswordSchema>;
export type ExpiredLinkType = z.infer<typeof expiredLinkSchema>;
