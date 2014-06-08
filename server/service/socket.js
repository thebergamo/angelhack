var config = require(__dirname + '/../config/general.json');
var io = require('socket.io-client')(config.bitcoin);
var async = require('async');
var request = require('request');
var mongoose = require('mongoose');
var io = require('socket.io-emitter')(config.redis);
var Transaction = mongoose.model('transaction');
var Message = mongoose.model('message');
var emitter = require('socket.io-emitter')(config.redis);

var bitQueue = async.queue(function(tx, callback){
    Transaction.findOne({'wallet.hash' : tx.address}, function(err, doc){
        if(!doc)
            return;

        doc.wallet.block_trans_id = tx.txid;
        doc.wallet.confirmations = tx.confirmations;
        doc.value = tx.value;
        doc.buyer.wallet = tx.from;

        //pagamento processando;
        if(tx.confirmations < 6 && doc.status != 'recive'){
            doc.status = 'recive';
            var m = new Message({ sender: 'system', message: 'Processando valores...', transaction_id: doc._id, finished: false });

            m.save(function(err){
                if(err)
                    throw err;
            });

        }

        if(tx.confirmations >= 6 && doc.status != 'paid'){
            doc.status = 'paid';
            var m = new Message({ sender: 'system', message: 'Pagamento confirmado!', transaction_id: doc._id, finished: false });

            m.save(function(err){
                if(err)
                    throw err;
            });
        }

        doc.save(function(err){
            if(err)
                throw err;

            io.to(doc.code).emit('update');
            emitter.to(doc.code).emit('update');
            callback();
        });
    });
});

io.on('connect', function(){
    io.emit('subscribe', 'tx');
    io.emit('subscribe', 'block');
    io.emit('subscribe', 'inv');
});

io.on('tx', function(data){
    request.get(config.bitcoin + '/tx/' + data.txid, function(err, header, tx){
        if(err)
            throw err;

        tx.vout.forEach(function(vout){
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
