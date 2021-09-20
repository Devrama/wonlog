#!/usr/bin/env node

import argsParser from 'yargs-parser';
import 'wonlog-server';
import express from 'express';
import path from 'path';
import fs from 'fs';

const DEFAULT_PORT = 7979;
const DEFAULT_SERVER_HOST = '0.0.0.0';
const DEFAULT_URL_HOST = '127.0.0.1';

// The code below in the comment is in packages/wonlog-server/src/application.ts
// .option('--webapp-host [host]', 'UDP Server host', '0.0.0.0') // This is used in /packages/wonlog in the release build. TODO. find a better way.
// .option('--webapp-port [port]', 'UDP Server port', '7979'); // This is used in /packages/wonlog in the release build. TODO. find a better way.
const options = argsParser(process.argv);

const WEBAPP_BASE_PATH =
  process.env.NODE_ENV !== 'development' ? '../../' : '../../dist';

const app = express();

app.get('/', function (req, res) {
  const buffer = fs.readFileSync(
    path.join(__dirname, WEBAPP_BASE_PATH, 'webapp', 'index.html'),
    { flag: 'r' }
  );
  const html = buffer
    .toString()
    .replace(
      '%%WONLOG_RELEASE_WEBSOCKET_URL%%',
      `ws://${options['http-host'] || '127.0.0.1'}:${
        options['http-port'] || 7978
      }`
    );
  res.set('Content-Type', 'text/html');
  res.send(html);
});
app.use(express.static(path.join(__dirname, WEBAPP_BASE_PATH, 'webapp')));

app.listen(
  options['webapp-port'] || DEFAULT_PORT,
  options['webapp-host'] || DEFAULT_SERVER_HOST,
  (): void => {
    console.log(
      '  Open your browser and go to http://%s:%d',
      options['webapp-host'] || DEFAULT_URL_HOST,
      options['webapp-port'] || DEFAULT_PORT
    );
  }
);
