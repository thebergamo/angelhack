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

// Carregando todas as APIs
requi(__dirname + '/api');

// Iniciando o servidor http
app.listen(config.port);
