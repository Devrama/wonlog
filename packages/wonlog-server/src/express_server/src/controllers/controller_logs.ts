import { Request, Response } from 'express';
import { RequestHandlerMap } from '../../../_won_modules/won-node-framework';
import { WonlogController } from '../helpers/classes/WonlogController';

export class ControllerLogs extends WonlogController {
  public getExpressHandlers(): RequestHandlerMap {
    return {
      deliverLogsHandler: this.deliverLogsHandler.bind(this),
    };
  }

  private deliverLogsHandler(req: Request, res: Response): void {
    const { data } = req.body;
    this._webSocketServer.broadcast(data);
    res.send({});
  }
}
