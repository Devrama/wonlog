import dgram from 'dgram';
import split2 from 'split2';
import JSON5 from 'json5';
import { Command } from 'commander';
import { nanoid } from 'nanoid';
import { parseISO } from 'date-fns';
import { AgentLog } from '../types/wonlog_shared';

const program = new Command();
program
  .option('-h, --host [host]', 'Server host', '127.0.0.1')
  .option('-p, --port [port]', 'Server port', '7081')
  .option('-s, --stream-name [name]', 'Stream name')
  .option('-m, --mute [type]', 'Disable printing logs', false);

program.parse(process.argv);

const _options = program.opts();
_options.streamName = _options.streamName ?? nanoid();

if (!_options.mute) {
  process.stdin.pipe(process.stdout);
}

let _isStdinClosed = false;
let _countMessagesInQueue = 0;
const _udpClient = dgram.createSocket('udp4');
_udpClient.bind(function () {
  _udpClient.setBroadcast(true);
});

process.stdin.pipe(split2()).on('data', function (textLog) {
  const hydratedLog: AgentLog = {
    streamID: _options.streamName,
    logXRefID: nanoid(),
    timestamp: Date.now(),
    data: {},
  };
  let isJson = true;
  let parsedLog: Record<string, unknown> | undefined = undefined;

  try {
    parsedLog = JSON5.parse(textLog);
  } catch (err) {
    isJson = false;
  }
  if (isJson && typeof parsedLog?.timestamp === 'number') {
    hydratedLog.timestamp = parsedLog.timestamp;
  } else if (isJson && typeof parsedLog?.timestamp === 'string') {
    const parsedTime = parseISO(parsedLog.timestamp).getTime();
    hydratedLog.timestamp = isNaN(parsedTime) ? Date.now() : parsedTime;
  }

  hydratedLog.data = parsedLog ?? textLog;
  const buffer = Buffer.from(JSON.stringify(hydratedLog));

  _countMessagesInQueue++;
  _udpClient.send(
    buffer,
    0,
    buffer.length,
    _options.port,
    _options.host,
    function () {
      _countMessagesInQueue--;
      if (_isStdinClosed && _countMessagesInQueue === 0) {
        _udpClient.close();
      }
    }
  );
});

process.stdin.on('end', function () {
  _isStdinClosed = true;
  if (!_countMessagesInQueue) {
    _udpClient.close();
  }
});

export class StreamStdinToUDP {}
