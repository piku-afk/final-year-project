import { z, ZodString } from 'zod';

export const ZodValidators = {
  description: z.string().min(5),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Not a valid email'),
  end: z.date(),
  name: z
    .string({ required_error: 'Name is required' })
    .min(3, 'Name should be at least 3 characters long'),
  makeOptionalString: (input: ZodString) => input.optional().or(z.literal('')),
  organization: z
    .string()
    .min(3, 'Organization name should be at least 3 characters long'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password should be at least 6 characters long'),
  start: z.date(),
  title: z.string().min(3),
};
