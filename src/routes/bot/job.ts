import { Router, Request, Response } from "express";
import {
    createJobBodySchema,
    CreateJobDTO,
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
    const { userId, url, type, depth } = createJobBodySchema.parse(req.body);

    const newJob = await JobService.createJob(url, type, depth, userId);

    await rabbitMQClient.sendTask({
        jobId: newJob.jobId,
        userId,
        url,
        status: newJob.status,
        type: newJob.type,
        depth: newJob.depth
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
        new BadRequestError("invalid jobId");
    }

    const job = await JobService.getJobById(jobId);

    if (!job) {
        new NotFoundError("job not found");
    }

    res.json(job);
});

// пометить джобу как отправленную
router.put("/sent/:id", async (req: Request, res: Response<CreateJobDTO>) => {
    const jobId = parseInt(req.params.id, 10);
    if (isNaN(jobId)) {
        new BadRequestError("invalid id");
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
