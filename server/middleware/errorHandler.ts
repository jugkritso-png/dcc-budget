import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`[Global Error] ${req.method} ${req.url}:`, err);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong.'
    });
};
