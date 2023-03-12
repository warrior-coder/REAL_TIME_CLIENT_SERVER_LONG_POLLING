/*
long pooling - the easiest way of real-time communication between client and server
    * unidirectional (data is sent only by server)
    * uses HTTP
    * sent headers along with HTTP for every interchange
    * can automatically recover if connection terminated

*/
const express = require('express');
const cors = require('cors');
const events = require('events');

const port = 3001;
const app = express();
const eventEmitter = new events.EventEmitter();

// parses JSON body in request
app.use(express.json());

// enable CORS (Cross-Origin Resource Sharing) to allow requests from remote hosts
app.use(cors());

app.get('/messages', (request, response) => {
    // subscribe once on event but not reply
    eventEmitter.once('post-message', (message) => {
        // reply to all waiting clients only when event emitted
        const data = {
            message: message,
        };

        response.status(200).json(data);
    });
});

app.post('/messages', (request, response) => {
    const message = request.body.message;

    // check message availability
    if (!message) {
        response.status(404).send('Message not found.');
    }

    // emit event only when someone posts message
    eventEmitter.emit('post-message', message);

    response.status(200).send();
});

app.listen(port, () => {
    console.log(`Server started on port ${port}.`);
});
