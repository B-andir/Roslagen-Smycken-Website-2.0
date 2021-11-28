const express = require('express');
const http = require('http');

const PORT = (process.env.PORT + 1);

const app = express();

app.use(express.static(__dirname + '/images'));

var server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`\nImage Server running on port ${PORT}\n`);
});