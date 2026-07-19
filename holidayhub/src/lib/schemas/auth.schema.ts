import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const customerRegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number').optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const vendorStep1Schema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const vendorStep2Schema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  businessType: z.enum(['tour-operator', 'activity-provider', 'both']),
  registrationNumber: z.string().optional().or(z.literal('')),
  gstNumber: z.string().optional().or(z.literal('')),
  businessAddress: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type CustomerRegisterFormData = z.infer<typeof customerRegisterSchema>;
export type VendorStep1Data = z.infer<typeof vendorStep1Schema>;
export type VendorStep2Data = z.infer<typeof vendorStep2Schema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;