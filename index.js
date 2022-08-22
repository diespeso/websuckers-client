const { Client } = require('./Client');
const { BroadcastClient } = require('./BroadcastClient');

const SERVER_URL = 'ws://192.168.1.33:443';

const client = new Client();
const client1 = new Client();
const client2 = new Client();

client.connect(SERVER_URL);
client1.connect(SERVER_URL);
client2.connect(SERVER_URL);

const broadcastClient = new BroadcastClient();
broadcastClient.connect(SERVER_URL)
    .then((readyCliente) => {
        readyCliente.sendBroadcast('testing...');
    });