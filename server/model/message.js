var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sendgrid = require(__dirname + '/../lib/sendgrid');
var config = require(__dirname + '/../config/general.json');
var emitter = require('socket.io-emitter')(config.redis);

var messageSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    transaction_id : String,
    sender: String,
    message: String,
    finished: Boolean
});

messageSchema.post('save', function(next){
    sendgrid(this.transaction_id, 'update', this._id);
});

messageSchema.post('save', function(doc){

    var Message = mongoose.model('message');
    var Transaction = mongoose.model('transaction');

    Message.find({finished: true, transaction_id: doc.transaction_id })
        .exec(function (err, docs){
            if(err)
                throw err;

            if(docs && docs.length !== 2)
                return;

            Transaction.findById(doc.transaction_id, function(err, tx){
                if(err)
                    throw err;

                console.log('ENTREI AQUI', tx);

                if(tx.status !== 'closed'){

                    Transaction.findById(doc.transaction_id, function(err, doc){
                        if(err)
                            throw err;

                        doc.status = 'closed';
                        doc.save(function(err){
                            if(err)
                                throw err;

                            emitter.to(doc.transaction_id).emit('update');
                        });
                    });

                    sendgrid(doc.transaction_id, 'close');
                }
            });

    });

    emitter.to(doc.transaction_id).emit('update');
});


mongoose.model('message', messageSchema);
