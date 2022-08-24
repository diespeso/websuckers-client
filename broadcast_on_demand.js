// SCRIPT FOR BROADCASTING ON DEMAND (READING USER INPUT)

const dotenv = require('dotenv');
const prompt = require('prompt');

const { BroadcastClient } = require('./BroadcastClient');
const { MESSAGE_TYPES } = require('./constants');

const promptForBroadcast = async () => {
    return new Promise((resolve, reject) => {
        prompt.get(['broadcast'], (err, result) => {
            // broadcaster.sendBroadcast(result.broadcast);
            if (err) {
                reject(err);
            }
            resolve(result.broadcast);
        });
    });
    
};

dotenv.config();
prompt.start();

const broadcaster = new BroadcastClient();
broadcaster.muteMessageType(MESSAGE_TYPES.BROADCAST);
broadcaster.connect(process.env.SERVER_URL)
    .then(async (connectedBroadcaster) => {
        while (true) {
            broadcaster.sendBroadcast(await promptForBroadcast());
        }
    })


