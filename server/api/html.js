var app = require(__dirname + '/../lib/express');
var path = require('path');

app.get('/', function(req, res){
    res.sendfile(path.join(__dirname, '../template/index.html'));
});
