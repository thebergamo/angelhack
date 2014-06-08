/**
 *  ╭∩╮（︶︿︶）╭∩╮
 *
 *  É nóis que voa bruxão v0.0.1
 *
 */

var requi = require('requi');
var app = require(__dirname + '/lib/express');
var config = require(__dirname + '/config/general.json');
var mongoose = require('mongoose').connect(config.mongodb);
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server);
var ioRedis = require('socket.io-redis');
var socket = require(__dirname + '/service/socket');

io.adapter(ioRedis(config.redis));

io.on('connection', function(socket){
    socket.on('join', function(rooms){
        [].concat(rooms).forEach(function(room){
            socket.join(room);
            socket.emit('joined', rooms);
        });
    });

    socket.on('leave', function(rooms){
        [].concat(rooms).forEach(function(room){
            socket.leave(rooms);
            socket.emit('leaved', rooms);
        });
    });
});

// Carregando todas os models
var models = requi(__dirname + '/model');

// Carregando todas as APIs
requi(__dirname + '/api');

// Iniciando o servidor http
server.listen(config.port);
