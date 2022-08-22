const { WebSocket } = require('ws');

const { sendJson, receiveJson } = require('./utils');
const { MESSAGE_TYPES } = require('./constants');

const RETRY_CONN_INTERVAL = 2000;
const DEBUG = true;
const debug = (text) => { if (DEBUG) {console.log(text);} }

const REFUSED_CONN_ERROR_CODE = 'ECONNREFUSED';

const SECRET = 'SECRETSTRING';

// DEFINITION

class Client {
    constructor() {
        this.serverUrl = null;
        this.ws = null;
        this.id = null;
        this.connected = false;
        console.log('client started.');
    }

    connect(serverUrl) {
        return new Promise((resolve, reject) => {
            this.serverUrl = serverUrl;
            this.ws = new WebSocket(this.serverUrl);
            console.log(`attempting to connect with server at: ${this.serverUrl}...`);
    
            this.ws.on('error', (err) => {
                if (err.code === REFUSED_CONN_ERROR_CODE) {
                    console.log(`failed to communicate with the server, retrying after ${RETRY_CONN_INTERVAL} ms...`);
                    this.connected = false;
                    //reject(err);
                }
            });
    
            this.ws.on('open', () => {
                console.log('connected to server.');
                this.connected = true;
                this.sendGreetMessage();
                // resolve(this);
            });
    
            this.ws.on('close', () => {
                this.sendMessage(MESSAGE_TYPES.TEXT, { text: 'closing...'});
                setTimeout(this.connect.bind(this, serverUrl), RETRY_CONN_INTERVAL);
            });
    
            this.ws.on('message', (message) => {
                const data = receiveJson(message.toString());
                if (data) {
                    if (data.messageType === MESSAGE_TYPES.GRANT_IDENTIFIER) {
                        this.id = data.id;
                        debug(`this client is now known as ${this.id} by the server`);
                        resolve(this);
                    } else {
                        this.handleMessage(data);
                    }   
                }
            });
        });
        
    }

    sendGreetMessage() {
        this.sendMessage(MESSAGE_TYPES.GREET, { secret: SECRET });
    }

    sendMessage(messageType, messageObject) {
        if (this.connected) {
            sendJson(this.ws, {
                messageType,
                id: this.id,
                ...messageObject
            });
        } else {
            console.log('not ready to send message');
        }
    }

    handleMessage(data) {
        debug(`debug> id: ${this.id}`);
        debug(data);
        switch (data.messageType) {
            case MESSAGE_TYPES.BROADCAST:
                debug(`user with id ${data.id} sent a broadcast. `);
                console.log(`received broadcast: ${data.broadcast}`);
                break;
        }
    }

}

module.exports = {
    Client,
};