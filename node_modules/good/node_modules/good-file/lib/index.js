// Load modules

var Fs = require('fs');
var Path = require('path');
var Async = require('async');
var GoodReporter = require('good-reporter');
var Hoek = require('hoek');
var Stringify = require('json-stringify-safe');

// Declare internals

var internals = {
    defaults: {
        maxLogSize: Infinity
    }
};


internals.nextFileNumber = function (startIndex) {

    return function () {

        startIndex++;
        var s = "0000" + startIndex;
        return s.substr(s.length-3);
    };
};


internals.dateTimefile = function (path, number) {

    return Path.join(path, Date.now() + '.' + number);
};


internals.namedFile = function (path, name, number) {

    return Path.join(path, name + '.' + number);
};


internals.buildWriteStream = function (path, queue) {

    var result = Fs.createWriteStream(path, { flags: 'a'});
    result.on('drain', function () {

        queue.resume();
    });

    result._good = {
        length: 0
    };

    return result;
};


module.exports = internals.GoodFile = function (path, options) {

    Hoek.assert(this.constructor === internals.GoodFile, 'GoodFile must be created with new');
    Hoek.assert(typeof path === 'string', 'path must be a string');

    var settings = Hoek.clone(options);
    settings = Hoek.applyToDefaults(internals.defaults, settings);

    GoodReporter.call(this, settings);

    if (path[path.length -1] === '/') {
        this._directory = path.slice(0, -1);
        this._getFileName = internals.dateTimefile.bind(this, Path.resolve(this._directory));
        this._name = false;
    }
    else {
        this._directory = Path.dirname(path);
        this._getFileName = internals.namedFile.bind(this, Path.resolve(this._directory), Path.basename(path));
        this._name = Path.basename(path);
    }
};


Hoek.inherits(internals.GoodFile, GoodReporter);


internals.GoodFile.prototype.start = function (emitter, callback) {

    var self = this;

    self._queue = Async.queue(function (data, next) {

        if (self._currentStream._good.length + data.bytes >= self._settings.maxLogSize) {
            self._currentStream.removeAllListeners('drain');
            self._currentStream.end();

            var nextLog = self._getFileName(self._nextNumber());
            self._currentStream = internals.buildWriteStream(nextLog, self._queue);
        }

        if (!self._currentStream.write(data.event)) {
            self._queue.pause();
        }

        self._currentStream._good.length += data.bytes;

        next();
    }, 10);

    Fs.readdir(this._directory, function (err, filenames) {

        if (err) {
            return callback(err);
        }

        var extNum = 0;
        filenames.forEach(function (filename) {

            if (!self._name || filename.indexOf(self._name) > -1) {
                var fileExtNum = parseInt(Path.extname(filename).substr(1), 10) || -1;
                extNum = Math.max(fileExtNum, extNum);
            }
        });

        self._nextNumber = internals.nextFileNumber(extNum);
        self._currentStream = internals.buildWriteStream(self._getFileName(self._nextNumber()), self._queue);

        emitter.on('report', self._handleEvent.bind(self));

        callback(null);
    });
};


internals.GoodFile.prototype.stop = function () {

    this._currentStream.end();
    this._queue.kill();
};


internals.GoodFile.prototype._report = function (event, eventData) {


    var eventString = Stringify(eventData);
    var data = new Buffer(eventString + '\n');

    this._queue.push({
        event: data,
        bytes: data.length
    });
};