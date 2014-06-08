function sendMail(data, message){
    var body = message;
    var email = new sendgrid.Email();

    data.forEach(function(mail){
        email.addTo()
    });

    data.subscribes.forEach(function(subscribe){
            toBcc.push(subscribe.user);
    });

    body += "<h2>Evento: "+data.info.title+"</h2>";
    body += "<h3>Timeline "+data.info.hashtag+"</h3>";
    body += "<table>";
    data.posts.forEach(function(post){
        body += "<tr> <td>"+ post.data+ " &nbsp; &nbsp; &nbsp; &nbsp; "+ post.text +"</td></tr>";
    });

    body += "</table>";
    body += "<br />";



    var payload = {
        bcc: toBcc,
        to: toBcc,
        from: 'clerigo-son@hotmail.com',
        subject: 'Bitify '+,
        text: 'Enviado pelo SendGrid',
        html: body
    };
    sendgrid.send(payload, function(err, json) {
        if (err) {
            console.error(err);
        }
        console.log(json);
    });
}

function recoveryPosts(data, id){
    db.collection('post').find({"timeline_id":id.toString()}).toArray(
        function(err, item){
            if(err)
                throw err;

            data.posts = item;

            recoverySubscribe(data, id);
        });
}

function recoverySubscribe(data, id){
    db.collection('subscribe').find({"timeline_id":id.toString()}).toArray(
        function(err, item){
            if(err)
                throw err;

            data.subscribes = item;

            sendMail(data);
        });
}
