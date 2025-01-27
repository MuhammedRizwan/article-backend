import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import AppError from '../../domain/error/AppError'
import StatusCodes from '../../domain/constants/StatusCode';
import ResponseMessages from '../../domain/constants/ResponseMessage';
import Token from '../../domain/constants/TokenConstants';
import { ApiResponse } from '../../domain/response/response';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export default function JwtMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies.accessToken;

  if (!token) {
    const response = new ApiResponse(false,ResponseMessages.ACCESS_TOKEN_MISSING)
    res.status(StatusCodes.UNAUTHORIZED).json(response);
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);

    if (!decoded) {
      throw new AppError(StatusCodes.FORBIDDEN, ResponseMessages.INVALID_TOKEN);
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie(Token.ACCESS_TOKEN, { httpOnly: true });
    res.clearCookie(Token.REFRESH_TOKEN, { httpOnly: true });
    next(error);
  }
};
