import { Router, Request, Response } from "express";
import {
    createJobBodySchema,
    CreateJobDTO,
    jobAnalyzerSettings,
    JobDTO,
    JobsReadyDTO,
} from "../../types";
import { JobService } from "../../service/jobService";
import { BadRequestError } from "../../errors/badRequest";
import { NotFoundError } from "../../errors/notFoundError";
import { rabbitMQClient } from "../../rabbit";

const router = Router();

// status string - готово ли

// depth от 0 до X -?
// type 0 или 1 - платная ли джоба

// CREATE JOB REQUEST
router.post("/", async (req: Request, res: Response<CreateJobDTO>) => {
    const { userId, url, type, settings } = createJobBodySchema.parse(req.body);

    // создаем в бд
    const newJob = await JobService.createJob(url, type, userId, settings);

    // отправляем в очередь
    await rabbitMQClient.sendTask({
        jobId: newJob.jobId,
        userId,
        url,
        status: newJob.status,
        type: newJob.type,
        settings: newJob.settings
    });

    const dto: CreateJobDTO = {
        jobId: newJob.jobId,
        userId: newJob.userId,
        status: newJob.status,
    };

    res.status(201).json(dto);
});

// получить готовые джобы
router.get("/ready", async (req: Request, res: Response<JobsReadyDTO>) => {
    const jobs = await JobService.getJobByStatus("ready");

    const dto: JobsReadyDTO = jobs.map((job) => {
        return {
            jobId: job.jobId,
        };
    });

    res.json(dto);
});

// получить полностью джобу и ее результат по id
router.get("/:id", async (req: Request, res: Response<JobDTO>) => {
    const jobId = parseInt(req.params.id, 10);
    if (isNaN(jobId)) {
        throw new BadRequestError("invalid jobId");
    }

    const job = await JobService.getJobById(jobId);
    if(!job?.settings) {
        throw new NotFoundError("no job settings");
    } 
    const jobSettings = jobAnalyzerSettings.parse(JSON.parse(job?.settings));

    if (!job || !job.userId || !job.jobId) {
        throw new NotFoundError("job not found");
    }

    res.json({
        userId: job.userId,
        jobId: job.jobId,
        type: job.type || null,
        url: job.url || null,
        result: job.result || null,
        status: job.status || null,
        settings: jobSettings
    });
});

// пометить джобу как отправленную
router.put("/sent/:id", async (req: Request, res: Response<CreateJobDTO>) => {
    const jobId = parseInt(req.params.id, 10);
    if (isNaN(jobId)) {
        throw new BadRequestError("invalid id");
    }

    const job = await JobService.updateJobStatus(jobId, "sent");

    const dto: CreateJobDTO = {
        jobId: job.jobId,
        userId: job.userId,
        status: job.status,
    };

    res.status(201).json(dto);
});

export default router;
