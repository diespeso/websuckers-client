
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
    sendJson,
    receiveJson,
}