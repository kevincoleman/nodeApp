var Hapi = require('hapi');
var Good = require('good');

// Create a server with a host and port
var server = new Hapi.Server('localhost', 8000);

// / to main
server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply('laterList will be a thing.');
  }
});

// /name to name script
server.route({
  method: 'GET',
  path: '/{name}',
  handler: function (request, reply) {
    reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
  }
});

server.pack.register(Good, function (err) {
  if (err) {
    throw err;
  }
  // Start the server
  server.start(function(){
    // Log that the server is running
    server.log('info', 'Server running at:' + server.info.uri);
  });
})
