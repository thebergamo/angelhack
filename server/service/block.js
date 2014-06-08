var bitcore = require('bitcore');
var async = require('async');
var config = require(__dirname + '/../config/general.json');
var Peer = bitcore.Peer;
var PeerManager = bitcore.PeerManager;

var txQueue = async.queue(function(task, callback){
    console.log(task);
    callback();
}, 1);

var peerman = new PeerManager({
    network: bitcore.networks.livenet
});

peerman.addPeer(new Peer(config.bitcoin.host, config.bitcoin.port));

peerman.on('connection', function(conn) {
    console.log('** Connected **');

    conn.on('inv', handleInv);
    conn.on('block', handleBlock);

});

var handleBlock = function(info) {
    info.message.txs.forEach(function(tx){
        txQueue.push(tx.getStandardizedObject());
    });
};

var handleInv = function(info) {
    var invs = info.message.invs;
    info.conn.sendGetData(invs);
};

peerman.start();
