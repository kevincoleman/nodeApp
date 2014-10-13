# good-file

File logging module for [good](https://github.com/hapijs/good) process monitoring.

![Build Status](https://travis-ci.org/hapijs/good-file.svg?branch=master) ![Current Version](https://img.shields.io/npm/v/good-file.svg)

Lead Maintainer: [Adam Bretz](https://github.com/arb)

## Usage

`good-file` is a [good-reporter](https://github.com/hapijs/good-reporter) implementation to write hapi server events to log files.

## Good File
### new GoodFile (path, [options])

creates a new GoodFile object with the following arguments
- `path` - (required) location to write log files. "./path/" creates {timestamp} file in "./path/". "./path/log_name" creates "log_name" in "./path/". All log files created with `good-file` have three digit numerical extensions that are padded with "0"s ("1410562652544.005" or "log_name.005"). If "./path/" has any existing log files when this module is `start()`ed, the next number in sequence will be used.
- `[options]` - optional arguments object
	- `[events]` - an object of key value paris. Defaults to `{ request: '*', log: '*' }`.
		- `key` - one of ("request", "log", "error", or "ops") indicating the hapi event to subscribe to
		- `value` - an array of tags to filter incoming events. An empty array indicates no filtering.
	- `[maxFileSize]` - how large a single log file can grow before a new one is created. Defaults to `Infinity`

### GoodFile Methods
`good-file` implements the [good-reporter](https://github.com/hapijs/good-reporter) interface as has no additional public methods.
