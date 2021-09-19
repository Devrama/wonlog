/*
 * application.ts is an entrypoint of all logic.
 */
import { ExpressServer } from './express_server';
import { WonlogUdpServer } from './udp_server';
import { WonlogWebSocketServer } from './websocket_server';
import { WonApplication } from './_won_modules/won-node-framework';

export class WonServerLocalApp implements WonApplication {
  public boot(): WonServerLocalApp {
    return this;
    // TODO
  }

  public start(): void {
    const expressServer = new ExpressServer(
      '0.0.0.0',
      Number(process.env.PORT) || 7979
    );
    expressServer.start();

    if (!expressServer.httpServer) {
      throw new Error('Cannot find httpServer'); // TODO
    }
    const wonWebSocketServer = new WonlogWebSocketServer(
      expressServer.httpServer
    );
    wonWebSocketServer.start();
    new WonlogUdpServer('0.0.0.0', 7878, wonWebSocketServer).start();
  }

  public stop(): void {
    // TODO
  }
}
