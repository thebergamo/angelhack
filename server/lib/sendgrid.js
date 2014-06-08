var sendgrid = require('sendgrid')('bovifi', 'bovifi');
var mongoose = require('mongoose');
var config = require(__dirname + '/../config/general.json');
function mailUpdate(id, id_message){
    //pegar model Transaction para pegar emails.
    //pegar model Message para enviar o update;

    var Transaction = mongoose.model('transaction');
    var Message = mongoose.model('message');

    Transaction.findById(id, function (err, doc) {
        if (err)
            throw err;

        Message.findById(id_message, function (err, message){
            if(err)
                throw err;

            var email = new sendgrid.Email();
            var body = "";
            var urlTrack = config.url+'/transaction/'+doc.code;

            body += '<h2>Atualização a vista!!.</h2><br />';
            body += '<p>Sua transação referente ao pedido: '+doc.title+'(<a href="'+urlTrack+'">'+doc.code+'</a>) foi atualizada.</p>';
            body += '<p>Mensagem:</p>';
            body += '<p><strong>'+message.message+'</strong></p>';
            body += '<br /><br /><br />';
            body += '<p>Para conferir ou enviar uma nova atualização também <a href="#">clique aqui</a>.</p>';
            body += '<br /><br />';

            email.setFrom(config.delivery.sender);

            email.setSubject('Sua transação foi atualizada!');

            email.setText('Enviado via SendGrid!');

            email.setHtml(body);

            if(message.sender === "buyer"){
                console.log('buyer');
                email.addTo(doc.seller.email);
            }else if(message.sender === "seller"){
                console.log('seller');
                email.addTo(doc.buyer.email);
            }else if(message.sender === "system") {
                console.log('system');
                email.to = [doc.seller.email,doc.buyer.email];
                //email.addTo(doc.buyer.email);
            }



            sendgrid.send(email, function(err, json) {
                if(err)
                    throw err;

                console.log(json);
            });

        });

    });




}

function mailBegin(id){
    //pegar model Transaction para pegar emails e enviar a senha dos mesmos.
    var Transaction = mongoose.model('transaction');

    Transaction.findById(id, function (err, doc) {
        if (err)
            throw err;

        var emailBuyer = new sendgrid.Email();
        var emailSeller = new sendgrid.Email();
        var body = "";
        var bodyBuyer = "";
        var bodySeller = "";
        var urlTrack = config.url+'/transaction/'+doc.code;

        body += '<h2>Seja bem vindo ao Bitify!</h2><br />';
        body += '<p>Sua transação foi iniciada com sucesso.</p>';
        body += '<p>Para sua maior segurança foi gerada uma senha de acesso a sua transação.</p>';
        body += '<p>Com essa senha de acesso você poderá consultar sua transação e atualiza-lá quando necessário.</p>';
        body += '<p>Para conferir as atualizações das suas transações <a href="'+urlTrack+'">clique aqui</a></p>';
        body += '<br /><br /><br />';
        body += '<p>Caso não consiga acessar o link acesse nossa página inicial: <a href="'+config.url+'">http://bitify.co</a> e insira o código abaixo.</p>';
        body += '<p>O código da sua transação é: <strong>'+doc.code+'</strong> .</p>';
        body += '<br /><br />';
        bodyBuyer = body;
        bodySeller = body;
        bodyBuyer += '<p>Sua chave de identificação para atualizar a transação é: <strong>'+doc.buyer.password+'</strong> </p>';
        bodySeller += '<p>Sua chave de identificação para atualizar a transação é: <strong>'+doc.seller.password+'</strong> </p>';
        body = '<p>A cateira de operações será: '+doc.wallet.hash+'</p>';
        bodyBuyer += body;
        bodySeller += body;

        emailBuyer.addTo(doc.seller.email);
        emailSeller.addTo(doc.buyer.email);

        emailBuyer.setFrom(config.delivery.sender);
        emailSeller.setFrom(config.delivery.sender);

        emailBuyer.setSubject('Sua transação começou!');
        emailSeller.setSubject('Sua transação começou!');

        emailBuyer.setText('Enviado via SendGrid!');
        emailSeller.setText('Enviado via SendGrid!');

        emailBuyer.setHtml(bodyBuyer);
        emailSeller.setHtml(bodySeller);

        sendgrid.send(emailBuyer, function(err, json) {
            if(err)
                throw err;

            console.log(json);
        });

        sendgrid.send(emailSeller, function(err, json) {
            if(err)
                throw err;

            console.log(json);
        });

    });

}

function mailExceed(id, id_message){

    //pegar model Transaction para pegar emails
    //pegar model Message para ver quem excedeu o tempo da carteira.
    var Transaction = mongoose.model('transaction');
    var Message = mongoose.model('message');

    Transaction.findById(id, function (err, doc) {
        if (err)
            throw err;

        Message.findById(id_message, function (err, message){
            if(err)
                throw err;

            var email = new sendgrid.Email();
            var body = "";
            var urlTrack = config.url+'/transaction/'+doc.code;

            body += '<h2>Oops! Parece que tivemos um problema aqui.</h2><br />';
            body += '<p>Sua transação não pode ser concluida com sucesso.</p>';
            body += '<p>Mensagem:</p>';
            body += '<p><strong>'+message.message+'</strong></p>';
            body += '<br /><br /><br />';
            body += '<p>Pedimos por gentileza que inicie novamente a transação.</p>';
            body += '<br /><br />';

            email.addTo(doc.seller.email);
            email.addTo(doc.buyer.email);

            email.setFrom(config.delivery.sender);

            email.setSubject('Sua transação foi atualizada!');

            email.setText('Enviado via SendGrid!');

            email.setHtml(body);

            sendgrid.send(email, function(err, json) {
                if(err)
                    throw err;

                console.log(json);
            });

        });

    });

}

function mailClose(id){
    //pegar model Transaction para pegar emails e avisar que a transação foi
    //concluida com sucesso.
    var Transaction = mongoose.model('transaction');

    Transaction.findById(id, function (err, doc) {
        if (err)
            throw err;

        console.log(id);

        var email= new sendgrid.Email();
        var body = "";

        body += '<h2>Mais uma bela transação bem sucedida pelo Bitify!</h2><br />';
        body += '<p>Sua transação foi finalizada com sucesso.</p>';
        body += '<p>Esperamos que ambas as partes envolvidas nesta transação estejam satisfeitas!</p>';
        body += '<br /><br /><br />';
        body += '<p>Esperamos vocês em uma proxima transação!</p>';


        email.to = [doc.seller.email,doc.buyer.email];

        email.setFrom(config.delivery.sender);

        email.setSubject('Sua transação terminou!');

        email.setText('Enviado via SendGrid!');

        email.setHtml(body);

        sendgrid.send(email, function(err, json) {
            if(err)
                throw err;

            console.log(json);
        });

    });



}

module.exports = function(id, code, id_message) {

    if(code === 'update'){
        mailUpdate(id, id_message);
    }else if(code === 'begin'){
        mailBegin(id)
    }else if(code == 'exceed'){
        mailExceed(id, id_message);
    }else if(code == 'close'){
        mailClose(id);
    }

}
