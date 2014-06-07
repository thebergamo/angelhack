
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

mongoose.model('message', messageSchema);


