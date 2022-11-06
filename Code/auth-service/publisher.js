const amqb = require('amqlib/callback_api');

amqb.connect('amqlib://localhost', (err, con)=> {
    if(err) throw err;

    con.createChannel((err, channel)=> {
        if(err) throw err;

        let queue = "";
        channel.assertQueue(queue, (msg)=> {
            console.log(`Receive: ${msg.content.toString()}`);
        })
    })
})