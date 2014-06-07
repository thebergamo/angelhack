var app = require(__dirname + '/../lib/express');
var baucis = require('baucis');

baucis.rest('message');
app.use('/api', baucis());
