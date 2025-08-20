import { Router } from "express";
import { createJobBodySchema } from "../../types";
import { JobService } from "../../service/jobService";
import { BadRequestError } from "../../errors/badRequest";
import { NotFoundError } from "../../errors/notFoundError";

const router = Router();

// status string - готово ли

// depth от 0 до X -?
// type 0 или 1 - платная ли джоба

// CREATE JOB REQUEST
// todo: ADD TO RABBIT QUEUE
router.post("/", async (req, res) => {
    const { userId, url, type, depth } = createJobBodySchema.parse(req.body);

    const newJob = await JobService.createJob(url, type, depth, userId);

    res.status(201).json({
        jobId: newJob.jobId,
        userId: newJob.userId,
        status: newJob.status,
    });
});


// получить готовые джобы
router.get("/ready", async (req, res) => {
    const jobs = await JobService.getReadyJobs();
    res.json(jobs);
});


// получить полностью джобу и ее результат по id
router.get("/:id", async (req, res) => {
    const jobId = parseInt(req.params.id, 10);
     if (isNaN(jobId)) {
        new BadRequestError("invalid jobId")
    }

    const job = await JobService.getJobById(jobId);

    if (!job) {
        new NotFoundError("job not found")
    }
    res.json(job);
});

// пометить джобу как отправленную
router.put("/sent/:id", async (req, res) => {
    const jobId = parseInt(req.params.id, 10);
    if (isNaN(jobId)) {
        new BadRequestError("invalid jobId")
   }


})

export default router;