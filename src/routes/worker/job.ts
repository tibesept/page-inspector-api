import { Router, Request, Response } from "express";
import {
    createJobBodySchema,
    CreateJobDTO,
    jobSchemaDTO,
    updateJobBodySchema,
} from "../../types";
import { JobService } from "../../service/jobService";
import { BadRequestError } from "../../errors/badRequest";
import logger from "../../logger";

const router = Router();

// проверка существования джобы
router.get("/check/:id", async (req: Request, res: Response<Boolean>) => {
    const jobId = parseInt(req.params.id, 10);
    if (isNaN(jobId)) {
        new BadRequestError("invalid id");
    }

    const newJob = await JobService.getJobById(jobId);

    let doJobExist = false 

    if(newJob) {
        doJobExist = true
    }

    res.status(200).json(doJobExist);
});

// обновить результат джобы
router.put("/:id", async (req: Request, res: Response<CreateJobDTO>) => {
    const jobId = parseInt(req.params.id, 10);
    if (isNaN(jobId)) {
        new BadRequestError("invalid id");
    }

    const { result, status } = updateJobBodySchema.parse(req.body);

    const newJob = await JobService.updateJobResult(jobId, result, status);

    const dto: CreateJobDTO = {
        jobId: newJob.jobId,
        userId: newJob.userId,
        status: newJob.status,
    };

    res.status(201).json(dto);
});

export default router;
