import axios, { AxiosError } from 'axios';
import split2 from 'split2';
import JSON5 from 'json5';
import stripAnsi from 'strip-ansi';
import { Command } from 'commander';
import { nanoid } from 'nanoid';
import { parseISO } from 'date-fns';
import { AgentLog } from './types/wonlog_shared';

const program = new Command();
program
  .option('-h, --server-host [host]', 'HTTP Server host', '127.0.0.1')
  .option('-p, --server-port [port]', 'HTTP Server port', '7978')
  .option('-s, --stream-name [name]', 'Stream name')
  .option('-v, --verbose [type]', 'Print logs', false);

program.parse(process.argv);

const _options = program.opts();
_options.streamName = _options.streamName ?? nanoid();

if (_options.verbose) {
  process.stdin.pipe(process.stdout);
}

const axiosInstance = axios.create({
  baseURL: `http://${_options.serverHost}:${_options.serverPort}/api/v1/`,
});

const JUNK_MAX_SIZE = 50000;
let _buffer: string[] = [];
let _bufferSize = 0;
let _isTimedOut = false;
let _timeoutTimer: NodeJS.Timeout;

const timer = setInterval((): void => {
  _isTimedOut = true;
}, 300);

process.stdin.pipe(split2()).on('data', function (str) {
  clearTimeout(_timeoutTimer);
  try {
    let textLog = stripAnsi(str); // Strin ANSI escape codes

    if (textLog.length > JUNK_MAX_SIZE) {
      textLog = `A single log can't exceeeds the size of ${JUNK_MAX_SIZE} Bytes. -  ${textLog.substring(
        0,
        JUNK_MAX_SIZE
      )}...`;
    }

    const hydratedLog: AgentLog = {
      wonlogMetadata: {
        streamID: _options.streamName,
        logXRefID: nanoid(),
        timestamp: Date.now(),
      },
      data: {},
    };
    let isJSON = true;
    let isObject = false;
    let parsedLog: Record<string, unknown> | undefined = undefined;

    try {
      parsedLog = JSON5.parse(textLog);
      isObject = typeof parsedLog === 'object' && !Array.isArray(parsedLog);
    } catch {
      isJSON = false;
    }

    if (isJSON && isObject) {
      hydratedLog.data = parsedLog as Record<string, unknown>;

      if (!hydratedLog.data.message) {
        hydratedLog.data.message = `${textLog.substring(0, 200)}...`;
      }

      if (isJSON && typeof parsedLog?.timestamp === 'number') {
        hydratedLog.wonlogMetadata.timestamp = parsedLog.timestamp;
      } else if (isJSON && typeof parsedLog?.timestamp === 'string') {
        const parsedTime = parseISO(parsedLog.timestamp).getTime();
        hydratedLog.wonlogMetadata.timestamp = isNaN(parsedTime)
          ? Date.now()
          : parsedTime;
      }
    } else {
      // Either text log or non-object JSON
      hydratedLog.data = { message: textLog };
      hydratedLog.wonlogMetadata.timestamp = Date.now();
    }

    const stringifiedData = JSON.stringify(hydratedLog);
    const stringifiedDataSize = stringifiedData.length;
    const sendLogs = (): void => {
      axiosInstance
        .post('logs', {
          data: `[${_buffer.join(',')}]`,
          meta: { timestamp: Date.now() },
        })
        .catch((err: AxiosError) => {
          console.error(err.message);
        });
    };

    if (JUNK_MAX_SIZE < _bufferSize + stringifiedDataSize || _isTimedOut) {
      sendLogs();

      _bufferSize = stringifiedDataSize;
      _buffer = [stringifiedData];
      _isTimedOut = false;
    } else {
      _bufferSize += stringifiedDataSize;
      _buffer.push(stringifiedData);
    }
    // Otherwise, the last message may stay in the agent forever.
    _timeoutTimer = setTimeout(() => {
      sendLogs();
      _bufferSize = 0;
      _buffer = [];
      _isTimedOut = false;
    }, 1000);
  } catch (err) {
    // Never stop this process.
    console.error('wonlog-agent error, reason: ', err);
    console.error('wonlog-agent error, original log: ', str);
  }
});

process.stdin.on('end', function () {
  clearTimeout(_timeoutTimer);
  clearInterval(timer);

  if (_buffer.length > 0) {
    axiosInstance
      .post('logs', {
        data: `[${_buffer.join(',')}]`,
        meta: { timestamp: Date.now() },
      })
      .catch((err: AxiosError) => {
        console.error(err.message);
      });
  }
});
