var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};

var server = http.createServer(
	function(request,response){
		var filePath = false;
		if (request.url == '/'){
			filePath = 'public/index.html';
		}
		else{
			filePath = 'public'+request.url;
		}
		var absPath = './'+filePath;
		serveStatic(response,cache,absPath);
	}
	);

server.listen(3000,function(){
	console.log("server listening on Port 3000.");
});

function send404(response){
	response.writeHead(404,{'Content-Type':'text/plain'});
	response.write('Error 404: resource not found or unknown error');
	response.end();
	console.log("sending 404");
}

function sendFile(response,filePath,fileContents){
	response.writeHead(
		200,
		{"Content-Type":mime.lookup(path.basename(filePath))}
	);
	response.end(fileContents);
	console.log("sending File");
}

function serveStatic (response,cache,absPath) {
	if (cache[absPath]){
		sendFile(response,absPath,cache[absPath])
		console.log("served cached");
	} 
	else {
		fs.exists (absPath,function(exists){
			if (exists) {
				fs.readFile (absPath,function(err,data){
					if (err) {
						send404(response);
					} else {
						cache[absPath] = data;
						sendFile(response,absPath,data);
						console.log("served new");
					}
				}
				)
			} 
			else {
				send404(response);
			}
		});
	}
	
}