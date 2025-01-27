import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import corsOptions from '../../../config/corsConfig';
import router from '../route/router';
import errorHandler from '../../../adapter/middleware/ErrorHandle.middleware';
import dotenv from 'dotenv';

dotenv.config();
const createApp = (): Application => {
  const app = express();

  app.use(morgan('tiny'));
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use('/', router);

  app.use(errorHandler);

  return app;
};

export default createApp;
