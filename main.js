// require
  var http = require('http');
  var fs = require('fs');

// script
http.get("file.txt", function(response){
  response.setEncoding("utf8");
  response.on('data', console.log);
  response.on('error', console.error);
});
