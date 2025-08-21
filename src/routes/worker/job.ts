import { Router, Request, Response } from "express";
import {
    createJobBodySchema,
    CreateJobDTO,
    updateJobBodySchema,
} from "../../types";
import { JobService } from "../../service/jobService";
import { BadRequestError } from "../../errors/badRequest";

const router = Router();

// обновить результат джобы
router.put("/:id", async (req: Request, res: Response<CreateJobDTO>) => {
    const jobId = parseInt(req.params.id, 10);
    if (isNaN(jobId)) {
        new BadRequestError("invalid id");
    }

    const { result } = updateJobBodySchema.parse(req.body);

    const newJob = await JobService.updateJobResult(jobId, result, "ready");

    const dto: CreateJobDTO = {
        jobId: newJob.jobId,
        userId: newJob.userId,
        status: newJob.status,
    };

    res.status(201).json(dto);
});

export default router;
