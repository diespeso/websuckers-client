const RANDOM_STRING_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const RANDOM_STRING_LENGTH = 32;

const generateRandomStandardString = () => {
    let result = '';
    for (let i = 0; i < RANDOM_STRING_LENGTH; i += 1) {
        result += RANDOM_STRING_CHARACTERS[(Math.random() * RANDOM_STRING_LENGTH).toFixed(0)];
    }
    return result;
}

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

module.exports = {
    generateRandomStandardString,
    sendJson,
    receiveJson,
}