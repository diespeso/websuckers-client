const { Client } = require('./Client');
const { MESSAGE_TYPES } = require('./constants');

class NotificationClient extends Client {
    constructor() {
        super();
        this.destinations = [];
    }

    registerClient(clientId) {
        this.destinations.push(clientId);
    }

    notify(notification) {
        this.destinations.forEach((destination) => {
            this.sendMessage(MESSAGE_TYPES.TEXT, { text: notification, destination});
        })
    }
}

module.exports = {
    NotificationClient,
}