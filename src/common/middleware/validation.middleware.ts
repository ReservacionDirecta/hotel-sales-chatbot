import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ValidationMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // Validate incoming requests here
        next();
    }
}