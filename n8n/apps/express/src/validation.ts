import { z } from "zod";

export const signupSchema = z.object({
    email: z.email(),
    name: z.string().min(3),
    password: z.string().min(8).max(20),
    
})

export const signinSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(20),
    
})