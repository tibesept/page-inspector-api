import { Router } from "express";
import { createJobBodySchema, updateJobBodySchema } from "../../types";
import { JobService } from "../../service/jobService";
import { BadRequestError } from "../../errors/badRequest";

const router = Router();


// обновить результат джобы
router.put("/:id", async (req, res) => {
    const jobId = parseInt(req.params.id, 10);
    if (isNaN(jobId)) {
        new BadRequestError("invalid id")
   }

    const { result, status } = updateJobBodySchema.parse(req.body);

    const newJob = await JobService.updateJobResult(jobId, result, status);

    res.status(201).json({
        jobId: newJob.jobId,
        userId: newJob.userId,
        status: newJob.status,
    });
});


export default router;