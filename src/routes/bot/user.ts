import { Router } from "express";
import { createJobBodySchema } from "../../types";
import { prisma } from "../../db";
import { UserService } from "../../service/userService";
import { BadRequestError } from "../../errors/badRequest";

const router = Router();

router.get("/:id", async (req, res) => {
    console.log("get");
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
        new BadRequestError("invalid userId")
    }
    const user = await UserService.getUserAndCreateIfNotExists(userId);
    
    res.json(user);
});

export default router;
