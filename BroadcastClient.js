const { Client } = require('./Client');
const { sendJson, receiveJson } = require('./utils');
const { MESSAGE_TYPES } = require('./constants');

class BroadcastClient extends Client {
    constructor() {
        super();
    }
    
    sendBroadcast(broadcast) {
        this.sendMessage(MESSAGE_TYPES.BROADCAST, { broadcast });
    }
}

module.exports = {
    BroadcastClient,
}