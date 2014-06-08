
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    transaction_id : String,
    sender: String,
    message: String
});

messageSchema.pre('save', function(next){

    var Message = mogoose.model('message');
    var Transaction = mogoose.model('transaction');
    var self = this;

    Message.find({sender: (this.sender === 'seller') ? 'buyer': 'seller' , code: 1})
        .toArray(function (err, docs){
            if(err)
                throw err;

            if(!docs)
                return next();

            Transaction.findByIdAndUpdate(this.transaction_id, { $set: { status: 'closed' }});

            /*
            Disparar email;
            Liberar bitcoin.
            */
            next();
    });

    //next();
});


mongoose.model('message', messageSchema);
