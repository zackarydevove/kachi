import Send from '@utils/response.util';
import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodType } from 'zod';

// Validate schema for each api, to check what we receive is correct or not
class ValidationMiddleware {
  static validateBody(schema: ZodType) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = schema.safeParse(req.body);

        if (!result.success) {
          // Format errors like { email: ['error1', 'error2'], password: ['error1'] }
          const formattedErrors: Record<string, string[]> = {};

          result.error.issues.forEach((err) => {
            const field = err.path.join('.'); // Get the field name
            if (!formattedErrors[field]) {
              formattedErrors[field] = [];
            }
            formattedErrors[field].push(err.message); // Add validation message
          });

          return Send.validationErrors(res, formattedErrors);
        }

        // Validation passed, continue to next middleware
        next();
      } catch (error) {
        // If it's another type of error, send a generic error response
        return Send.error(res, 'Invalid request data');
      }
    };
  }
}

export default ValidationMiddleware;
