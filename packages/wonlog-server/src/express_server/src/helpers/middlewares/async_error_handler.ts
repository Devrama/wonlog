import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

function asyncErrorHandler(middleware: AsyncMiddleware): RequestHandler {
  return (req, res, next): void => {
    middleware(req, res, next).catch((err) => {
      next(err);
    });
  };
}

export default asyncErrorHandler;
