var http = require('http');
var url = require('url');
var querystring = require('querystring');
var static = require('node-static');
var file = new static.Server('.');


function accept(req, res)
{
    file.serve(req, res);
}


console.log("Startuem");
if (!module.parent) {
  http.createServer(accept).listen(8080);
} else {
  exports.accept = accept;
}