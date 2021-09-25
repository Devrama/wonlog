import { RequestHandler } from 'express';

export interface RequestHandlerMap {
  [handlerName: string]: RequestHandler;
}

export interface WonController {
  getExpressHandlers(): RequestHandlerMap;
}
