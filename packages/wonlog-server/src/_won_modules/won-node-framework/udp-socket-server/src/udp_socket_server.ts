import dgram from 'dgram';
import { WonServer } from '../../base';

export abstract class WonUdpSocketServer implements WonServer {
  private readonly ip: string;
  private readonly port: number;
  private _udpServer: dgram.Socket | null = null;

  constructor(ip: string, port: number) {
    this.ip = ip;
    this.port = port;
  }

  public boot() {
    // TODO
  }

  public start() {
    this._udpServer = dgram.createSocket('udp4');
    this._attachEvents();
    this.udpServer.bind(this.port, this.ip);
  }

  public stop() {
    // TODO
  }

  private _attachEvents() {
    this.udpServer.on('message', (data: Buffer, remote: object) => {
      this.onMessage(data, remote);
    });
  }

  private get udpServer() {
    if (!this._udpServer) {
      throw new Error('UDP server did not start yet');
    }
    return this._udpServer;
  }

  protected abstract onMessage(data: Buffer, remote: object): void;
}
