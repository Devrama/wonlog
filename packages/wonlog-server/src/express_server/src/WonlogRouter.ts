import express, { Router } from 'express';
import { ControllerLogs } from './controllers/controller_logs';
import { WonlogExpressApp } from './WonlogExpressApp';

export class WonlogRouter {
  private _router: Router;
  private _wonlogExpressApp: WonlogExpressApp;

  constructor(wonlogExpressApp: WonlogExpressApp) {
    this._wonlogExpressApp = wonlogExpressApp;
    this._router = express.Router();
    this.initialize();
  }

  private initialize(): void {
    const controllerLogs = new ControllerLogs(
      this._wonlogExpressApp
    ).getExpressHandlers();
    this._router.post('/api/v1/logs', controllerLogs.deliverLogsHandler);
  }

  public getExpressRouter(): Router {
    return this._router;
  }
}
