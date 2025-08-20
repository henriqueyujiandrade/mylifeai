import { z } from 'zod'

export const loginSchema = z.object({
  emailOrUsername: z
    .string()
    .min(1, 'Username or email is required')
    .refine((value) => {
      // Check if it's a valid email OR a valid username (minimum 3 characters)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const isEmail = emailRegex.test(value)
      const isUsername = value.length >= 3 && /^[a-zA-Z0-9_.-]+$/.test(value)
      
      return isEmail || isUsername
    }, 'Please enter a valid email address or username (min 3 characters)'),
    
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must be less than 128 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>