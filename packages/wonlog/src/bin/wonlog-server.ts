#!/usr/bin/env node

import 'wonlog-server';
import express from 'express';
import path from 'path';

const WEBAPP_BASE_PATH =
  process.env.NODE_ENV !== 'development' ? '../../' : '../../dist';

const app = express();
app.use(express.static(path.join(__dirname, WEBAPP_BASE_PATH, 'webapp')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, WEBAPP_BASE_PATH, 'webapp', 'index.html'));
});

app.listen(3000);
