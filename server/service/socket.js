var config = require(__dirname + '/../config/general.json');
var io = require('socket.io-client')(config.bitcoin);
var async = require('async');
var request = require('request');
var mongoose = require('mongoose');
var emitter = require('socket.io-emitter')(config.redis);
var Transaction = mongoose.model('transaction');
var Message = mongoose.model('message');
var emitter = require('socket.io-emitter')(config.redis);

var bitQueue = async.queue(function(tx, callback){
    console.log('Procurando por ' + tx.address, tx);
    Transaction.findOne({'wallet.hash' : tx.address}, function(err, doc){
        if(err)
            throw err;

        if(!doc)
            return;

        doc.wallet.block_trans_id = tx.txid;
        doc.wallet.confirmations = tx.confirmations;
        doc.value = tx.value;
        doc.buyer.wallet = tx.from;
        doc.status = 'recive';

        //pagamento processando;
        var m = new Message({
            sender: 'system',
            message: 'Valor de BTC ' + tx.value + ' recebido, aguardando confirmação dos peers.',
            transaction_id: doc._id,
            finished: false
        });

        m.save(function(err){
            if(err)
                throw err;
        });

        doc.save(function(err){
            if(err)
                throw err;

            emitter.to(doc._id).emit('update');
            callback();
        });
    });
}, 40);

io.on('connect', function(){
    io.emit('subscribe', 'tx');
    io.emit('subscribe', 'block');
    io.emit('subscribe', 'inv');
});

io.on('tx', function(data){
    request.get(config.bitcoin + '/api/tx/' + data.txid, function(err, header, tx){
        tx = JSON.parse(tx);

        if(err)
            throw err;

        tx.vout.forEach(function(vout){
            if(vout.scriptPubKey.addresses)
                bitQueue.push({
                    tx : data.txid,
                    from : tx.vin[0].addr,
                    address : vout.scriptPubKey.addresses[0],
                    confirmations : tx.confirmations || 0,
                    value : vout.value
                });
        });
    });
});
