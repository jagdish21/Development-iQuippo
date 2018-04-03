// Setup server
var app = express();
var server = require('http').createServer(app);
var socket=require('socket.io')(server);

require('./realTimeSocket')(socket);
