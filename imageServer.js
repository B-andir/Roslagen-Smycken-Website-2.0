const express = require('express');
const http = require('http');

const PORT = 5101;

const app = express();

app.use(express.static(__dirname + '/images'));

var server = http.createServer(app);

// var io = require('socket.io').listen(server);

server.listen(PORT, () => {
    console.log(`\nImage Server running on port ${PORT}\n`);
});
