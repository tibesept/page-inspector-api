import { z } from "zod";

// BODY VALIDATION
export const createJobBodySchema = z.object({
    userId: z.number(),
    url: z.string().url({ message: "Неверный формат URL" }),
    type: z.number(),
    depth: z.number().int().min(1), // Глубина должна быть хотя бы 1
});

export const updateJobBodySchema = z.object({
    result: z.string(),
});

// DTO (API RESPONSES)

export const userSchemaDTO = z.object({
    userId: z.number(),
    balance: z.number(),
});

export const postJobSchemaDTO = z.object({
    jobId: z.number(),
    userId: z.number(),
    status: z.string(),
});

export const JobsReadySchemaDTO = z.array(
    z.object({
        jobId: z.number(),
    }),
);

export const JobSchemaDTO = z
    .object({
        userId: z.number(),
        type: z.number(),
        url: z.string(),
        depth: z.number(),
        result: z.string(),
        jobId: z.number(),
        status: z.string(),
    })
    .nullable();

// RABBIT

export const jobTaskSchema = z.object({
    jobId: z.number(),
    userId: z.number(),
    url: z.string(),
    status: z.string(),
});

// TYPES
export type CreateJobBody = z.infer<typeof createJobBodySchema>;
export type JobsReadyDTO = z.infer<typeof JobsReadySchemaDTO>;
export type JobDTO = z.infer<typeof JobSchemaDTO>;
export type UserDTO = z.infer<typeof userSchemaDTO>;
export type CreateJobDTO = z.infer<typeof postJobSchemaDTO>;

export type JobTask = z.infer<typeof jobTaskSchema>;
