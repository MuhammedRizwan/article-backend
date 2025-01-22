import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../util/custom_error';

declare global {
    namespace Express {
      interface Request {
        user?: any;
      }
    }
  }
export default function JwtMiddleware(req:Request, res: Response, next:NextFunction): void {
  const token = req.cookies.accessToken;

  if (!token) {
    res.status(401).json({ success: false, message: 'Access token is missing or expired' });  
    return 
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string); 
    if(!decoded) {
      throw new CustomError(403, "Invalid payload");
    }
    req.user = decoded; 
    next();
  } catch (error) {
    res.clearCookie('accessToken', { httpOnly: true }); 
    next(error); 
  }
};