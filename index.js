const dotenv = require('dotenv');

dotenv.config();

const { Client } = require('./Client');
const { BroadcastClient } = require('./BroadcastClient');
const { NoiseBroadcastClient } = require('./NoiseBroadcastClient');

const SERVER_URL = process.env.SERVER_URL;

const client = new Client();
const client1 = new Client();

client.connect(SERVER_URL);
client1.connect(SERVER_URL);


const noise = new NoiseBroadcastClient();
noise.connect(SERVER_URL);
noise.startNoise();
