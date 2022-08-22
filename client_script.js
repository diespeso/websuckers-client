const { WebSocket } = require('ws');

const SERVER_URL = 'ws://192.168.1.33:443';
const RETRY_CONN_INTERVAL = 2000;
const DEBUG = true;
const debug = (text) => { if (DEBUG) {console.log(text);} }

const REFUSED_CONN_ERROR_CODE = 'ECONNREFUSED';

const MESSAGE_TYPES = {
    GREET: 'GREET',
    GRANT_IDENTIFIER: 'GRANT_IDENTIFIER',
    TEXT: 'TEXT',
    BROADCAST: 'BROADCAST',
};

const SECRET = 'SECRETSTRING';

let clientIdentifier = null;

let ws;

// COMMON STARTS

const sendJson = (ws, json) => (ws.send(JSON.stringify(json)));

const receiveJson = (message) => {
    let received;
    try {
        received = JSON.parse(message);
    } catch (e) {
        if (e.name === 'SyntaxError') {
            console.log('failed to parse received data as JSON: bad format');
        }
    }
    return received;
};

const buildMessage = (messageType, messageObject) => ({
    messageType,
    id: clientIdentifier,
    ...messageObject
});

const handleMessage = (ws, data) => {
    debug(data);
    switch (data.messageType) {
        case MESSAGE_TYPES.GRANT_IDENTIFIER:
            clientIdentifier = data.id;
            debug(`this client is now known as ${clientIdentifier} by the server`);
            break;
    }
}

const sendMessage = (ws, messageType, messageObject) => {
    sendJson(ws, buildMessage(messageType, messageObject));
}

// COMMON ENDS

const sendGreetMessage = (ws) => {
    sendJson(ws, buildMessage(MESSAGE_TYPES.GREET, { secret: SECRET }));
};

const connection = () => {
    ws = new WebSocket(SERVER_URL);

    ws.on('error', (err) => {
        if (err.code === REFUSED_CONN_ERROR_CODE) {
            console.log(`failed to communicate with the server, retrying after ${RETRY_CONN_INTERVAL} ms...`);
        }
    })

    ws.on('open', () => {
        console.log('connected to server.');
        sendGreetMessage(ws);
    });

    ws.on('close', () => {
        setTimeout(connection, RETRY_CONN_INTERVAL);
    });

    ws.on('message', (message) => {
        const data = receiveJson(message.toString());
        if (data) {
            handleMessage(ws, data);
        }
    });
};

console.log('client started.');
console.log(`attempting to connect with server at: ${SERVER_URL}...`)
connection();


