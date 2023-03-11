const express = require('express');
const cors = require('cors');
const events = require('events');

const port = 3001;
const app = express();
const eventEmitter = new events.EventEmitter();

// used to parse JSON body
app.use(express.json());

// enable CORS (Cross-origin resource sharing) to allow requests from remote hosts
app.use(cors());

app.get('/messages', (request, response) => {
    // subscribe once on event but server not reply
    eventEmitter.once('post-message', (message) => {
        // server replies to all waiting clients only when event emitted
        const data = {
            message: message,
        };

        response.status(200).json(data);
    });
});

app.post('/messages', (request, response) => {
    const message = request.body.message;

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
