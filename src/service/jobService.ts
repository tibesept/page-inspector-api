import { Job } from "@prisma/client";
import { prisma } from "../db";
import { JobAnalyzerSettingsDB } from "../types";

export class JobService {
    static async createJob(url: string, type: number, userId: number, settings: JobAnalyzerSettingsDB): Promise<Job> {
        return await prisma.job.create({
            data: {
                url,
                type,
                userId,
                settings: JSON.stringify(settings)
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

    static async updateJobStatus(jobId: number, status: string): Promise<Job> {
        return await prisma.job.update({
            where: {
                jobId
            },
            data: {
                status
            },
        });
    }

    static async getJobByStatus(status: string): Promise<{
        jobId: number;
        userId: number;
        url: string;
        status: string;
    }[]> {
        return await prisma.job.findMany({
            where: {
                status
            },
            select: {
                jobId: true,
                userId: true,
                url: true,
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