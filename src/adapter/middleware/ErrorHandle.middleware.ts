import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import AppError from '../../domain/error/AppError';
import StatusCodes from '../../domain/constants/StatusCode';
import ResponseMessages from '../../domain/constants/ResponseMessage';
import { ApiResponse } from '../../domain/response/response';

const errorHandler: ErrorRequestHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  if (err instanceof AppError) {

    const response = new ApiResponse(false,err.message)
    res.status(err.statusCode).json(response);
  } else {

    const response = new ApiResponse(false, ResponseMessages.INTERNAL_ERROR)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response)
  };
}
export default errorHandler;
