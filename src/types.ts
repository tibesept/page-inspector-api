import { z } from "zod";

// SCHEMAS
export const createJobBodySchema = z.object({
    userId: z.number(),
    url: z.string().url({ message: "Неверный формат URL" }), // Добавим валидацию URL
    type: z.number(),
    depth: z.number().int().min(1), // Глубина должна быть хотя бы 1
});

export const updateJobBodySchema = z.object({
    result: z.string(),
    status: z.string()
});

export const jobSchema = z.object({
    jobId: z.number(),
    userId: z.number(),
    status: z.string(),
});

export const jobsDoneSchema = z.array(jobSchema);

export const userSchema = z.object({
    userId: z.number(),
    balance: z.number(),
});

// TYPES
export type CreateJobBody = z.infer<typeof createJobBodySchema>;
export type Job = z.infer<typeof jobSchema>;
export type JobsDone = z.infer<typeof jobsDoneSchema>;
export type User = z.infer<typeof userSchema>;