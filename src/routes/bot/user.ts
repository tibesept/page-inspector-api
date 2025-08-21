import { Router, Request, Response } from "express";
import { createJobBodySchema, UserDTO } from "../../types";
import { prisma } from "../../db";
import { UserService } from "../../service/userService";
import { BadRequestError } from "../../errors/badRequest";
import logger from "../../logger";

const router = Router();

router.get("/:id", async (req: Request, res: Response<UserDTO>) => {

    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
        new BadRequestError("invalid userId")
    }

    
    const user = await UserService.getUserAndCreateIfNotExists(userId);
    const dto: UserDTO = {
        userId: user.userId,
        balance: user.balance
    } 

    res.json(user);
});

export default router;
