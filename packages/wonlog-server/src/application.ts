/*
 * application.ts is an entrypoint of all logic.
 */
import { Command } from 'commander';
import { ExpressServer } from './express_server';
import { WonlogWebSocketServer } from './websocket_server';
import { WonApplication } from './_won_modules/won-node-framework';

export class WonServerLocalApp implements WonApplication {
  #serverHost: string;
  #serverPort: number;

  constructor() {
    this.#serverHost = '0.0.0.0';
    this.#serverPort = 7978;
  }

  public boot(): WonServerLocalApp {
    const program = new Command();
    program
      .option('--webapp-host [host]', 'WebApp Server host', '0.0.0.0') // This is used in /packages/wonlog in the release build. TODO. find a better way.
      .option('--webapp-port [port]', 'WebApp Server port', '7979') // This is used in /packages/wonlog in the release build. TODO. find a better way.
      .option('--server-host [host]', 'HTTP Server host', '0.0.0.0')
      .option('--server-port [port]', 'HTTP Server port', '7978');

    program.parse(process.argv);
    const options = program.opts();

    this.#serverHost = options.serverHost;
    this.#serverPort = Number(options.serverPort);

    return this;
    // TODO
  }

  public start(): void {
    const expressServer = new ExpressServer(this.#serverHost, this.#serverPort);
    expressServer.start();

    if (!expressServer.httpServer) {
      throw new Error('Cannot find httpServer'); // TODO
    }
    const wonWebSocketServer = new WonlogWebSocketServer(
      expressServer.httpServer
    );
    wonWebSocketServer.start();

    expressServer.setWebSocketServer(wonWebSocketServer);
  }

  public stop(): void {
    // TODO
  }
}
