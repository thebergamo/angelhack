var app = require(__dirname + '/../lib/express');
var baucis = require('baucis');
var bitcore = require('bitcore');

var controller = baucis.rest('transaction');
controller.select('-wallet -buyer.password -seller.password');

app.use('/api', controller);
