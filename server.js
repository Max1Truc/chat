var app = require("express")(),
  server = require("http").createServer(app),
  io = require("socket.io").listen(server),
  fs = require("fs"),
  ent = require("ent"), // For XSS
  settings = require("./src/settings.json");

// If heroku is used, use its port, else use port in settîngs.json
var port = process.env.PORT || settings["port"];

// load settings
var messages_min_length = settings["messages_min_length"];
var messages_max_length = settings["messages_max_length"];

// load index.html
app
  .get("/", function(req, res) {
    res.sendFile(__dirname + "/src/index.html");
  })
  .get("/crypt.min.js", function(req, res) {
    res.sendFile(__dirname + "/src/js/crypt.min.js");
  })
  .get("/hash.js", function(req, res) {
    res.sendFile(__dirname + "/src/js/hash.js");
  });

io.sockets.on("connection", function(socket, pseudo) {
  socket.emit("length", {min: messages_min_length, max: messages_max_length});
  socket.on("new_client", function(pseudo) {
    socket.pseudo = ent.encode(pseudo);
    socket.broadcast.emit("new_client", pseudo);
  });

  socket.on("message", function(message) {
    // test crypted_message.length
    if (message.crypted_message.length < messages_min_length) {
      socket.emit("message", {
        pseudo: "SERVER",
        crypted_message: "message too short",
        hashed_channel: "SERVER"
      });
    } else if (message.hashed_channel == "SERVER") {
      socket.emit("message", {
        pseudo: "SERVER",
        crypted_message: "Can't use channel : SERVER",
        hashed_channel: "SERVER"
      });
    } else if (message.crypted_message.length <= messages_max_length) {
      // Send
      socket.broadcast.emit("message", {
        pseudo: socket.pseudo,
        crypted_message: message.crypted_message,
        hashed_channel: message.hashed_channel
      });
      socket.emit("message", {
        pseudo: socket.pseudo,
        crypted_message: message.crypted_message,
        hashed_channel: message.hashed_channel
      });
    } else {
      socket.emit("message", {
        pseudo: "SERVER",
        crypted_message: "message too long",
        hashed_channel: "SERVER"
      });
    }
  });
});

server.listen(port);

console.log("Server listening on port " + port);
