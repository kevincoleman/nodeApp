var Hapi = require('hapi');

// Create a server with a host and port
var server = new Hapi.Server('localhost', 8000);

// Log server running
console.log('Server running at:', server.info.uri);

// Add the route
server.route({
    method: 'GET',
    path: '/hello',
    handler: function (request, reply) {

        reply('laterList will be a thing.');
    }
});

// Start the server
server.start();
