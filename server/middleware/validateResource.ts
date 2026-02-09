import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (e: any) {
        if (e instanceof ZodError) {
            const errors = e.issues || (e as any).errors || [];
            console.log("[Validation Error] Issues:", errors);
            return res.status(400).json({
                error: 'Validation Error',
                details: errors.map((err: any) => ({
                    path: err.path.join('.'),
                    message: err.message
                }))
            });
        }
        console.error("Validation Middleware Error:", e);
        return res.status(400).json({ error: e.message || 'Unknown Validation Error' });
    }
};

export default validate;
