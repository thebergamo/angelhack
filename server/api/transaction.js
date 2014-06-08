var app = require(__dirname + '/../lib/express');
var baucis = require('baucis');
var bitcore = require('bitcore');

var controller = baucis.rest('transaction');
controller.select('-wallet.key -buyer.password -seller.password');

controller.methods('put delete head', false);

app.use('/api', controller);
