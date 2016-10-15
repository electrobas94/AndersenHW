

var static = require('node-static');
var file = new static.Server('.');
var http = require('http');

console.log("Startuem");

http.createServer(function(request, response) {
  var headers = request.headers;
  var method = request.method;
  var url = request.url;
  var body = [];
  request.on('error', function(err) {
    console.error(err);
  }).on('data', function(chunk) {
    body.push(chunk);
  }).on('end', function() {
    body = Buffer.concat(body).toString();
    
    if( url == "/add_recip")
    {
        console.log("add_new_recip: ", body); 
        let fs = require('fs');
        fs.appendFileSync('objects/reciep_list.json', body );
        
        response.end("OK");
    }
    else if ( url == "/add_prod" )
    {
        console.log("add_new_product: ", body);
        let fs = require('fs');
        fs.appendFileSync('objects/obj_list.json', body );
        
        response.end("OK");
    }
    else
        file.serve(request, response);
    // At this point, we have the headers, method, url and body, and can now
    // do whatever we need to in order to respond to this request.
  });
}).listen(8080); // Activates this server, listening on port 8080.