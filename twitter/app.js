var config = require(__dirname + '/general.json');
var Twitter = require('ntwitter');
var twitter = new Twitter(config.twitter);
var async = require('async');

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

var tweet = async.queue(function(task, callback){
    task = shuffle(task.replace(/(^|\W)@\w+/g, '').split(' ')).join(' ');

    twitter.updateStatus(task.substring(0, 123) + ' #angelhackrules', function(err, data){
        if(err)
            console.log(err.message);
        else
            console.log(new Date() + ' ' + task.substring(0, 133) + ' #angelhackrules');

        setTimeout(callback, 60000 + (Math.random() * (30000 - 10000) + 10000));
    });
});

twitter.stream('statuses/filter', { track: ['tech', 'startup', 'nodejs', 'asp.net', 'ruby', 'php', 'java', 'programmer'] }, function(stream) {
    stream.on('data', function(t) {
        if(tweet.length > 100 || t.user.screen_name === 'bovify' || ['pt', 'es', 'en', 'fr'].indexOf(t.lang) === -1)
            return;

        tweet.push(t.text);
    });
});
