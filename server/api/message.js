var app = require(__dirname + '/../lib/express');
var baucis = require('baucis');

var controller = baucis.rest('message');
controller.methods('put delete head', false);

app.use('/api', baucis());
