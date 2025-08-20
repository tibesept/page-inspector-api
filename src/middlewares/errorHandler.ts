import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

import { BaseError } from '../errors/baseError';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Ошибки от Zod
    if (err instanceof z.ZodError) {
        req.log.info({ errors: err.issues }, 'Validation error');
        return res.status(400).json({
            message: "Ошибка валидации",
            errors: err.issues.map(issue => ({ path: issue.path, message: issue.message }))
        });
    }

    // Ошибки от Prisma
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2003') { // ForeignKeyConstraintViolation
            req.log.warn({ userId: req.body.userId }, 'User not found for foreign key constraint');
            return res.status(404).json({ message: `Пользователь с ID ${req.body.userId} не найден` });
        }
    }

    // Кастомные ошибки
    if (err instanceof BaseError) {
        req.log.error({ err }, 'Caught custom error');
        return res.status(err.code).json({
            message: err.message
        });
    }



    req.log.error({ err }, 'Internal server error');
    return res.status(500).json({ message: "Внутренняя ошибка сервера" }); // return чтоб не было "Can't set headers after they are sent"
};

export default errorHandler;