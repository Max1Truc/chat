var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), // for XSS
    fs = require('fs'),
    settings = require("./settings.json");

// If heroku is used, use his port, else use port in settîngs.json
var port = process.env.PORT || settings["port"];

// load index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
}).get('/alphabet', function (req, res) {
  res.sendfile(__dirname + '/alphabet.txt');
});

io.sockets.on('connection', function (socket, pseudo) {
    socket.on('new_client', function(pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('new_client', pseudo);
    });

    socket.on('message', function (message) {
		// test message.length
		if (message.length < 2) {
			socket.emit("message", { pseudo:"SERVER", message:"message too short"});
		} else if (message.length <= 50) {
			// Send
			console.log("message from " + socket.pseudo + " : " + message);
			message = ent.encode(message);
			socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
			socket.emit('message', {pseudo: socket.pseudo, message: message});
		} else {
			socket.emit("message", { pseudo:"SERVER", message:"message too long"});
		}
    }); 
});

server.listen(port);

console.log("Server listening on port " + port)
