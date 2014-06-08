var mongoose = require('mongoose');
var bitcore = require('bitcore');
var crypto = require('crypto');
var config = require(__dirname + '/../config/general.json');
var Schema = mongoose.Schema;
var sendgrid = require(__dirname + '/../lib/sendgrid');

function generateCode(length){
    var code = "";
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        code += chars.charAt(Math.floor(Math.random() * chars.length));

    return code;
}


var transactionSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    status: String,
    title: String,
    value: Number,
    code: String,
    wallet: {
        hash: String,
        key: String,
        block_trans_id: String,
        confirmations: String
    },
    seller: {
        email: String,
        wallet: String,
        password: String,
        name: String
    },
    buyer: {
        email: String,
        wallet: String,
        password: String,
        name: String
    }
});

transactionSchema.post('save', function(next){
    sendgrid(this._id, 'begin');
});

transactionSchema.pre('save', function(next){
    if(!this._id)
        return next();

    var password = String(new Date().getTime());
    var privateKey = bitcore.util.sha256(password);
    var code = generateCode(10);
    var codeSeller = generateCode(5);
    var codeBuyer = generateCode(5);

    var key = new bitcore.Key();
    key.private = privateKey;
    key.regenerateSync();

    var hash = bitcore.util.sha256ripe160(key.public);
    var version = bitcore.networks.livenet.addressVersion;

    var addr = new bitcore.Address(version, hash);

    this.buyer.password = codeBuyer;
    this.seller.password = codeSeller;


    this.code = code;
    this.wallet = {
        hash : addr,
        key : password
    };

    next();
});

mongoose.model('transaction', transactionSchema);
