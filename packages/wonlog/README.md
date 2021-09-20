# wonlog

Stream your local logs to browers to debug easier.

## Features

- stream raw text or JSON string logs to browser
- search logs by a keyword
- multiple log streams to a browser
- sort logs

## Screenshots

![Screenshot - darkmode](https://raw.githubusercontent.com/Devrama/wonlog/master/docs/assets/images/screenshot1.png)
![Screenshot - lightmode](https://raw.githubusercontent.com/Devrama/wonlog/master/docs/assets/images/screenshot2.png)
![Screenshot - search & settings](https://raw.githubusercontent.com/Devrama/wonlog/master/docs/assets/images/screenshot3.png)
![Screenshot - detail view](https://raw.githubusercontent.com/Devrama/wonlog/master/docs/assets/images/screenshot4.png)

## Installing

Using npm:
```bash
$ npm install -g wonlog
```

Using yarn:
```bash
$ yarn global add wonlog
```

## How to use

### First, run a wonlog server
```bash
$ wonlog-server
```

### Second, open your browser with `http://localhost:7979`

### Third, pipe your log to wonlog agents

```bash
# streaming output of you node server logs to wonlog agent
$ node your_express_server.js | wonlog-agent --stream-name='My First Log stream' --verbose

# openning a log file to wonlog agent
$ cat log_file.txt | wonlog-agent --stream-name='My First Log stream' --verbose

# streaming from a growing log file to wonlog agent
$ tail -F log_file.txt | wonlog-agent --stream-name='My First Log stream' --verbose
```
