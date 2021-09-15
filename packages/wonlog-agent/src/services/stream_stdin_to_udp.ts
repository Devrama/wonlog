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
let _buffer: AgentLog[] = [];
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

  hydratedLog.data = parsedLog ?? { message: textLog };
  _buffer.push(hydratedLog);
});

setInterval(() => {
  let junk: AgentLog[] = [];
  let currentJunkSize = 0;
  for (const element of _buffer) {
    const nextJunkSize = currentJunkSize + JSON.stringify(element).length;
    if (JUNK_MAX_SIZE < nextJunkSize) {
      const data = Buffer.from(JSON.stringify(junk));
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

      junk = [element]; // reset, and add the current element
      currentJunkSize = JSON.stringify(element).length; // reset, and add the length of the current element
    } else {
      junk.push(element); // add the current element
      currentJunkSize += JSON.stringify(element).length; // add the length of the current element
    }
  }

  if (junk.length > 0) {
    const data = Buffer.from(JSON.stringify(junk));
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
  }

  _buffer = []; // reset
}, 300);

process.stdin.on('end', function () {
  _isStdinClosed = true;
  if (!_countMessagesInQueue) {
    _udpClient.close();
  }
});

export class StreamStdinToUDP {}
