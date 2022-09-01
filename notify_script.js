/// sends a text message to a specific client in the server

const dotenv = require('dotenv');

const { NotificationClient } = require('./NotificationClient');

dotenv.config();

const listeners = ['5ee574ff-f8ff-421a-923f-36398e1330cd'];

const notifier = new NotificationClient();
listeners.forEach((listener) => {
    notifier.registerClient(listener);
})

notifier.connect(process.env.SERVER_URL).then((connectedNotifier) => {
    connectedNotifier.notify('ON');
});