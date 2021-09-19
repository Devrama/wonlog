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
  .option('-p, --port [port]', 'Server port', '7878')
  .option('-s, --stream-name [name]', 'Stream name')
  .option('-v, --verbose [type]', 'Print logs', false);

program.parse(process.argv);

const _options = program.opts();
_options.streamName = _options.streamName ?? nanoid();

if (_options.verbose) {
  process.stdin.pipe(process.stdout);
}

const JUNK_MAX_SIZE = 50000;
let _isStdinClosed = false;
let _countMessagesInQueue = 0;
let _buffer: string[] = [];
let _bufferSize: number = 0;
let _isTimedOut: boolean = false;
const _udpClient = dgram.createSocket('udp4');
_udpClient.bind(function () {
  _udpClient.setBroadcast(true);
});

const timer = setInterval((): void => {
  _isTimedOut = true;
}, 300);

process.stdin.pipe(split2()).on('data', function (textLog) {
  if (textLog.length > JUNK_MAX_SIZE) {
    console.error(
      `A single log can't exceeeds the size of ${JUNK_MAX_SIZE} Bytes`
    );
    return;
  }

  const hydratedLog: AgentLog = {
    wonlogMetadata: {
      streamID: _options.streamName,
      logXRefID: nanoid(),
      timestamp: Date.now(),
    },
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
    hydratedLog.wonlogMetadata.timestamp = parsedLog.timestamp;
  } else if (isJson && typeof parsedLog?.timestamp === 'string') {
    const parsedTime = parseISO(parsedLog.timestamp).getTime();
    hydratedLog.wonlogMetadata.timestamp = isNaN(parsedTime)
      ? Date.now()
      : parsedTime;
  }

  hydratedLog.data = parsedLog ?? { message: textLog };

  if (isJson && !hydratedLog.data.message) {
    hydratedLog.data.message = `${textLog.substring(0, 200)}...`;
  }

  const stringifiedData = JSON.stringify(hydratedLog);
  const stringifiedDataSize = stringifiedData.length;

  if (JUNK_MAX_SIZE < _bufferSize + stringifiedDataSize || _isTimedOut) {
    const data = Buffer.from(`[${_buffer.join(',')}]`);
    _countMessagesInQueue++;
    _udpClient.send(
      data,
      0,
      data.length,
      _options.port,
      _options.host,
      function () {
        _countMessagesInQueue--;
        if (_isStdinClosed && _countMessagesInQueue === 0) {
          _udpClient.close();
        }
      }
    );

    _bufferSize = stringifiedDataSize;
    _buffer = [stringifiedData];
    _isTimedOut = false;
  } else {
    _bufferSize += stringifiedDataSize;
    _buffer.push(stringifiedData);
  }
});

process.stdin.on('end', function () {
  _isStdinClosed = true;
  clearInterval(timer);
  if (!_countMessagesInQueue) {
    _udpClient.close();
  }
});

export class StreamStdinToUDP {}
