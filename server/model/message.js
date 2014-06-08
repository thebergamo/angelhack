var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sendgrid = require(__dirname + '/../lib/sendgrid');

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

//sendgrid(this._id, 'begin');

messageSchema.post('save', function(next){
    var self = this;

    sendgrid(this.transaction_id, 'update', this._id);

});

messageSchema.pre('save', function(next){

    var Message = mongoose.model('message');
    var Transaction = mongoose.model('transaction');
    var self = this;

    Message.find({sender: (this.sender === 'seller') ? 'buyer': 'seller' , finished: true, transaction_id: this.transaction_id })
        .exec(function (err, docs){
            if(err)
                throw err;


            if(!docs.lenght)
                return next();

            Transaction.findByIdAndUpdate(this.transaction_id, { $set: { status: 'closed' }});


            sendgrid(this.transaction_id, 'close');


            /*
            Liberar bitcoin.
            */
            next();
    });

    //next();
});


mongoose.model('message', messageSchema);
