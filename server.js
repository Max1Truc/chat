var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), // for XSS
    fs = require('fs'),
    settings = require("./src/settings.json");

// If heroku is used, use its port, else use port in settîngs.json
var port = process.env.PORT || settings["port"];

// load settings
var messages_min_length = settings["messages_min_length"];
var messages_max_length = settings["messages_max_length"];

// load index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/src/index.html');
});

io.sockets.on('connection', function (socket, pseudo) {
    socket.emit("length", {min:messages_min_length, max:messages_max_length});
    socket.on('new_client', function(pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('new_client', pseudo);
    });

    socket.on('message', function (message) {
		// test message.length
		if (message.message.length < messages_min_length) {
			socket.emit("message", {pseudo:"SERVER", message:"message too short", channel : "SERVER"});
		} else if (message.message.length <= messages_max_length) {
			// Send
			if (settings["log_messages"]) { console.log("message in channel "+message.channel+" from " + socket.pseudo + " : " + message.message);};
			message.message = ent.encode(message.message);
			socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message.message, channel : message.channel});
			socket.emit('message', {pseudo: socket.pseudo, message: message.message, channel : message.channel});
		} else {
			socket.emit("message", { pseudo:"SERVER", message:"message too long", channel : "SERVER"});
		}
    }); 
});

server.listen(port);

console.log("Server listening on port " + port)
