var Http = require('http');
var Hapi = require('hapi');
var EventEmitter = require('events').EventEmitter;
var GoodFile = require('../');

var server = new Hapi.Server('127.0.0.1', 31337);

var reporter = new GoodFile('./test/fixtures/example', { request: '*' });

server.start(function() {

    reporter.start(server, function(err) {

        if (err) {
            console.error(err);
            process.exit(1);
        }

        console.info('Server started at ' + server.info.uri);
        console.info('*** Starting triage ***');

        for (var i = 0; i <= 100; ++i) {
            Http.get(server.info.uri);
        }
        console.info('Done');
    });
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {

        server.emit('report', 'request', {
            event: 'request',
            timestamp: Date.now(),
            path: request.path,
            id: request.id
        });

        reply(200);
    }
});