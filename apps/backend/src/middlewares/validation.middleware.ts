import Send from '@utils/response.util';
import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodType } from 'zod';

// Validate schema for each api, to check what we receive is correct or not
class ValidationMiddleware {
  static validateBody(schema: ZodType) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const x = schema.safeParse(req.body);
        next();
      } catch (error) {
        console.log('errror dans validateBody: ', error);
        if (error instanceof ZodError) {
          // Format errors like { email: ['error1', 'error2'], password: ['error1'] }
          const formattedErrors: Record<string, string[]> = {};

          const result = schema.safeParse(error);
          console.log('result: ', result);

          // TODO : For each error, fulfill formatted Errors here

          // if (!result.success) {
          //   const parsed = JSON.parse(result.error.message);
          //   const message = parsed?.[0]?.message || "Invalid email or password";
          //   const path = parsed?.[0]?.path?.[0];
          // }

          //   z.flattenError(error);.forEach((err) => {
          //     const field = err.path.join('.'); // Get the field name
          //     if (!formattedErrors[field]) {
          //       formattedErrors[field] = [];
          //     }
          //     formattedErrors[field].push(err.message); // Add validation message
          //   });

          return Send.validationErrors(res, formattedErrors);
        }

        // If it's another type of error, send a generic error response
        return Send.error(res, 'Invalid request data');
      }
    };
  }
}

export default ValidationMiddleware;
