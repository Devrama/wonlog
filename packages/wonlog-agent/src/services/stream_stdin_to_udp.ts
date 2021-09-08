import dgram from 'dgram';
import split2 from 'split2';
import * as chrono from 'chrono-node';
import JSON5 from 'json5';
import yargs from 'yargs'; // TODO: Replace this by commander
import map from 'through2-map'; // TODO: consider to replace it by through2
import stripAnsi from 'strip-ansi';
import { nanoid } from 'nanoid'; // TODO: consider to replace it by 'chance'
// import updateNotifier from 'update-notifier'
// import pkg from '../../package.json'

/*!
 * inform the user of updates
 */
/*
updateNotifier({
  packageName: pkg.name,
  packageVersion: pkg.version
}).notify()
*/

/*!
 * parsing argv
 */
const argv = yargs
  .usage('Usage: cmd | rtail [OPTIONS]')
  .example('server | rtail > server.log', 'localhost + file')
  .example('server | rtail --id api.domain.com', 'Name the log stream')
  .example('server | rtail --host example.com', 'Sends to example.com')
  .example('server | rtail --port 43567', 'Uses custom port')
  .example('server | rtail --mute', 'No stdout')
  .example('server | rtail --no-tty', 'Strips ansi colors')
  .example('server | rtail --no-date-parse', 'Disable date parsing/stripping')
  .option('host', {
    alias: 'h',
    type: 'string',
    default: '127.0.0.1',
    describe: 'The server host',
  })
  .option('port', {
    alias: 'p',
    type: 'string',
    default: 9999,
    describe: 'The server port',
  })
  .option('id', {
    alias: 'name',
    type: 'string',
    default: nanoid,
    describe: 'The log stream id',
  })
  .option('mute', {
    alias: 'm',
    type: 'boolean',
    describe: 'Do not pipe stdin with stdout',
  })
  .option('tty', {
    type: 'boolean',
    default: true,
    describe: 'Keeps ansi colors',
  })
  .option('parse-date', {
    type: 'boolean',
    default: true,
    describe: 'Looks for dates to use as timestamp',
  })
  .help('help')
  //.version(pkg.version, 'version')
  .alias('version', 'v')
  .strict().argv;
/*!
 * setup pipes
 */
if (!argv.mute) {
  if (!process.stdout.isTTY || !argv.tty) {
    process.stdin
      .pipe(
        map(function (chunk) {
          return stripAnsi(chunk.toString('utf8'));
        })
      )
      .pipe(process.stdout);
  } else {
    process.stdin.pipe(process.stdout);
  }
}
/*!
 * initialize socket
 */
let isClosed = false;
let isSending = 0;
const socket = dgram.createSocket('udp4');
const baseMessage = { id: argv.id, timestamp: Date.now(), content: '' };
socket.bind(function () {
  socket.setBroadcast(true);
});
/*!
 * broadcast lines to browser
 */
process.stdin.pipe(split2()).on('data', function (line) {
  let timestamp: null | chrono.ParsedResult = null;
  try {
    // try to JSON parse
    line = JSON5.parse(line);
  } catch (err) {
    // look for timestamps if not an object
    timestamp = argv.parseDate ? chrono.parse(line)[0] : null;
  }
  if (timestamp) {
    // escape for regexp and remove from line
    // timestamp.text = timestamp.text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
    line = line.replace(new RegExp(' *[^ ]?' + timestamp.text + '[^ ]? *'), '');
    // use timestamp as line timestamp
    baseMessage.timestamp = timestamp.start.date().getTime();
  } else {
    baseMessage.timestamp = Date.now();
  }
  // update default message
  baseMessage.content = line;
  // prepare binary message
  const buffer = Buffer.from(JSON.stringify(baseMessage));
  // set semaphore
  isSending++;
  socket.send(buffer, 0, buffer.length, argv.port, argv.host, function () {
    isSending--;
    if (isClosed && !isSending) socket.close();
  });
});
/*!
 * drain pipe and exit
 */
process.stdin.on('end', function () {
  isClosed = true;
  if (!isSending) socket.close();
});

export class StreamStdinToUDP {}
