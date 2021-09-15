import http from 'http';
import { WonWebSocketServer } from '../../_won_modules/won-node-framework';
import { AgentLog, HydratedLog } from '../../types/wonlog_shared';

type IncomingLog = AgentLog;
type OutgoingLog = HydratedLog;

const streamSeqID = new Map<string, number>();

export class WonlogWebSocketServer extends WonWebSocketServer {
  constructor(httpServer: http.Server) {
    super(httpServer);
  }

  /**
   * @override
   */
  protected onBroadcast(buffer: Buffer): string {
    const incomingLogs: IncomingLog[] = JSON.parse(buffer.toString());
    const outgoingLogs: OutgoingLog[] = [];
    for (const { streamID, logXRefID, timestamp, data } of incomingLogs) {
      if (streamSeqID.has(streamID)) {
        streamSeqID.set(streamID, Number(streamSeqID.get(streamID)) + 1);
      } else {
        streamSeqID.set(streamID, 1);
      }

      outgoingLogs.push({
        ...data,
        message: data.message as string,
        wonlogMetadata: {
          seqID: streamSeqID.get(streamID) as number,
          streamID,
          logXRefID,
          timestamp,
          propertyNames: Object.keys(data),
        },
      });
    }

    return JSON.stringify(outgoingLogs);
  }
}
