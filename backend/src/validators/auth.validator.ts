import { z } from 'zod';

export const emailSchema = z.email({error: "Invalid email"}).trim().toLowerCase();

export const passwordSchema = z.string({error: "Password is required"}).min(3, {error: "Password must be at least 3 characters"});

export const registerSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    name: z.string({error: "Name is required"}).min(2, {error: "Name must be at least 2 characters"}).trim(),
    avatar: z.string({error: "Avatar must be a URL"}).optional()
})

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema
})


export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;