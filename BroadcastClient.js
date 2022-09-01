const { Client } = require('./Client');
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