# wonlog

Stream your local logs to browers.

This project is inspired by [rtail](https://github.com/kilianc/rtail).

## Features

- stream raw text or JSON string logs to browser
- search logs by a keyword
- multiple log streams to a browser
- sort logs
- uses UDP & WebSocket

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

# streaming from JSON to wonlog agent
$ echo '{ "foo": "bar" }' | wonlog-agent --stream-name='My First Log stream' --verbose
$ echo "{ foo: 'JSON5' }" | wonlog-agent --stream-name='My First Log stream' --verbose
```

# JSON log format

## Reserved Properties

- `timestamp`: If `timestamp` property exists in a JSON formt log with either ISO Date string or the number of milliseconds elapsed since Janunary 1, 1970, `TIMESTAMP` column on wonlog screen shows it instead of the `timestamp` of current time.
- `message`: If `message` property exists in a JSON format log, `MESSAGE` column shows it instead of stringified log.
- `level`: If `level` property exists with values below in a JSON format log, `TIMESTAMP` column shows in different colors.
    - `critical` or `fatal`
    - `error`
    - `warn` or `warning`
    - `info`
    - `debug`
    - `trace`

# CLI options

## `wonlog-server`

```bash
$ wonlog-server --help
Usage: index [options]

Options:
  --webapp-host [host]  WebApp Server host (default: "0.0.0.0")
  --webapp-port [port]  WebApp Server port (default: "7979")
  --http-host [host]    HTTP Server host (default: "0.0.0.0")
  --http-port [port]    HTTP Server port (default: "7978")
  --udp-host [host]     UDP Server host (default: "0.0.0.0")
  --udp-port [port]     UDP Server port (default: "7977")
  -h, --help            display help for command
```

## `wonlog-agent`

```
$ wonlog-agent --help
Usage: agent [options]

Options:
  -h, --udp-host [host]     UDP Server host (default: "127.0.0.1")
  -p, --udp-port [port]     UDP Server port (default: "7977")
  -s, --stream-name [name]  Stream name
  -v, --verbose [type]      Print logs (default: false)
  --help                    display help for command
```
