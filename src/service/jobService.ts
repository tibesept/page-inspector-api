import { Job } from "@prisma/client";
import { prisma } from "../db";

export class JobService {
    static async createJob(url: string, type: number, depth: number, userId: number): Promise<Job> {
        return await prisma.job.create({
            data: {
                url,
                type,
                depth,
                userId,
            },
        });
    }
    static async updateJobResult(jobId: number, result: string, status: string): Promise<Job> {
        return await prisma.job.update({
            where: {
                jobId
            },
            data: {
                result,
                status
            },
        });
    }

    static async getReadyJobs(): Promise<{
        jobId: number;
        status: string;
        userId: number;
    }[]> { // todo: fix
        return await prisma.job.findMany({
            select: {
                jobId: true,
                userId: true,
                status: true,
            },
        });
    }


    static async getJobById(id: number): Promise<Job | null> {
        return await prisma.job.findUnique({
            where: { jobId: id },
        });
    }
}