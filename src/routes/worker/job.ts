import { Router, Request, Response } from "express";
import {
    createJobBodySchema,
    CreateJobDTO,
    jobAnalyzerSettings,
    jobSchemaDTO,
    jobWorkerResultSchema,
    updateJobBodySchema,
} from "../../types";
import { JobService } from "../../service/jobService";
import { BadRequestError } from "../../errors/badRequest";
import logger from "../../logger";
import { aiService } from "../../service/AIService";
import { AIGettingSummaryError } from "../../errors/ai";

const router = Router();

// проверка существования джобы
router.get("/check/:id", async (req: Request, res: Response<Boolean>) => {
    const jobId = parseInt(req.params.id, 10);
    if (isNaN(jobId)) {
        throw new BadRequestError("invalid id");
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
        throw new BadRequestError("invalid id");
    }

    const { result, status } = updateJobBodySchema.parse(req.body);

    const newJob = await JobService.updateJobResult(jobId, result, status);
    const settings = jobAnalyzerSettings.parse(JSON.parse(newJob.settings));
    
    // --- AI SUMMARY ----
    if(settings.ai_summary) {
        const {
            screenshot, // скриншот нам не нужен 
            ...resultForSummary 
        } = jobWorkerResultSchema.parse(JSON.parse(newJob.result));
        const settings = jobAnalyzerSettings.parse(JSON.parse(newJob.settings));

        // получаем резюме от ИИ и сохраняем, если все ок
        aiService.getSummary({
            jobId: newJob.jobId,
            status: newJob.status,
            userId: newJob.userId,
            url: newJob.url,
            settings: settings, // чтоб ИИ понимал что пропаршено и не найдено, а чего изначально быть не должно
            result: resultForSummary
        }).then(summary => {
            if(!summary) throw new AIGettingSummaryError(new Error("No summary, nothing to update"));
            JobService.updateJobSummary(newJob.jobId, summary);
        });
    }

    const dto: CreateJobDTO = {
        jobId: newJob.jobId,
        userId: newJob.userId,
        status: newJob.status,
    };

    res.status(201).json(dto);
});

export default router;
