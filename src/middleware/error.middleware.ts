import { Request, Response, NextFunction } from "express";
import { CustomError } from "../util/custom_error"; 

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      message: err.message,
      data: err.data || null, 
    });
    return;
  }


  console.error(err);
  res.status(500).json({
    message: "Something went wrong, please try again later.",
  });
}
