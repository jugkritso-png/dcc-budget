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
            return res.status(400).json({
                error: 'Validation Error',
                details: (e as any).errors.map((err: any) => ({
                    path: err.path.join('.'),
                    message: err.message
                }))
            });
        }
        return res.status(400).send(e.errors);
    }
};

export default validate;
