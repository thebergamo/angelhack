var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var transactionSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    status: String,
    wallet: {
        hash: String,
        key: String
    },
    seller: {
        email: String,
        wallet: String,
        password: String,
        name: String,
    },
    buyer: {
        email: String,
        wallet: String,
        password: String,
        name: String,
    },
    messages: messageSchema,
    title: String,
    value: Number,
    code: String

});


var messageSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    sender: String,
    message: String,
});
