import authConfig from '@config/auth.config';
import Send from '@utils/response.util';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface DecodedToken {
  userId: number;
}

class AuthMiddleware {
  /**
   * Middleware to authenticate the user based on the access token stored in the HttpOnly cookie.
   * This middleware will verify the access token and attach the user information to the request object.
   */
  public static authenticateUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const token = req.cookies.accessToken;
    console.log('req.cookies in access token middleware: ', req.cookies);

    if (!token) return Send.unauthorized(res, null);

    try {
      const decodedToken = jwt.verify(token, authConfig.secret) as DecodedToken;
      (req as any).userId = decodedToken.userId;
      next();
    } catch (error) {
      console.error('Authentication failed:', error);
      return Send.unauthorized(res, null);
    }
  }

  public static refreshTokenValidation(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const refreshToken = req.cookies.refreshToken;
    console.log('req.cookies in refresh token middleware: ', req.cookies);
    if (!refreshToken)
      return Send.unauthorized(res, { message: 'No refresh token provided' });

    try {
      const decodedToken = jwt.verify(
        refreshToken,
        authConfig.refresh_secret,
      ) as { userId: number };
      (req as any).userId = decodedToken.userId;
      next();
    } catch (error) {
      console.error('Refresh Token authentication failed:', error);
      return Send.unauthorized(res, {
        message: 'Invalid or expired refresh token',
      });
    }
  }
}

export default AuthMiddleware;
