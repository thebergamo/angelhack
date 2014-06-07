var mongoose = require('mongoose');
var bitcore = require('bitcore');
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
        name: String
    },
    buyer: {
        email: String,
        wallet: String,
        password: String,
        name: String
    }
});

transactionSchema.pre('save', function(next){
    var password = String(new Date().getTime());
    var privateKey = bitcore.util.sha256(password);

    var key = new bitcore.Key();
    key.private = privateKey;
    key.regenerateSync();

    var hash = bitcore.util.sha256ripe160(key.public);
    var version = bitcore.networks.livenet.addressVersion;

    var addr = new bitcore.Address(version, hash);

    this.wallet = {
        hash : addr,
        key : password
    };

    next();
});

mongoose.model('transaction', transactionSchema);


