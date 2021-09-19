#!/usr/bin/env node

import { Command } from 'commander';
import 'wonlog-server';
import express from 'express';
import path from 'path';
import fs from 'fs';

const program = new Command();
program
  // .option('--http-host [host]', 'UDP Server host', '0.0.0.0') // This is set in wonlog-server
  // .option('--http-port [port]', 'UDP Server port', '7978') // This is set in wonlog-server
  .option('--webapp-host [host]', 'UDP Server host', '0.0.0.0')
  .option('--webapp-port [port]', 'UDP Server port', '7979');

program.parse(process.argv);
const options = program.opts();

const WEBAPP_BASE_PATH =
  process.env.NODE_ENV !== 'development' ? '../../' : '../../dist';

const app = express();
app.use(express.static(path.join(__dirname, WEBAPP_BASE_PATH, 'webapp')));

app.get('/', function (req, res) {
  const buffer = fs.readFileSync(
    path.join(__dirname, WEBAPP_BASE_PATH, 'webapp', 'index.html'),
    { flag: 'r' }
  );
  const html = buffer
    .toString()
    .replace(
      '%%WONLOG_WEBSOCKET_URL%%',
      `https://${options.httpHost}:${options.httpPort}`
    );
  res.set('Content-Type', 'text/html');
  res.send(html);
});

app.listen(options.webappPort, options.webappHost);
