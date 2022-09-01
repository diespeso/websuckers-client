const { BroadcastClient } = require('./BroadcastClient');
const { MESSAGE_TYPES } = require('./constants');
const {  generateRandomStandardString } = require('./utils');
const DEBUG = true;
const debug = (text) => { if (DEBUG) {console.log(text);} }

const NOISE_MAX_INTERVAL = 5000;

class NoiseBroadcastClient extends BroadcastClient {
    constructor() {
        super();
        this.interval = null;
        this.broadcast = null;
        this.flagRandomInterval = true;
        this.flagRandomBroadcast = true;
    }

    onTimeOut() {
        clearTimeout(this.timeOut);
        this.sendBroadcast(this.broadcast);
        if (this.flagRandomInterval) {
            this.interval = (Math.random() * NOISE_MAX_INTERVAL).toFixed(0);
        }
        if (this.flagRandomBroadcast) {
            this.broadcast = generateRandomStandardString(); //todo: que sea un texto
        }
        debug(`noise interval time: ${this.interval} ms.`);
        this.timeOut = setTimeout(this.onTimeOut.bind(this), this.interval);
    }

    startNoise(interval, broadcast) {   
        if (this.interval) {
            this.flagRandomInterval = false;
        }     
        if (this.broadcast) {
            this.flagRandomBroadcast = false;
        }
        this.interval = interval ?? (Math.random() * NOISE_MAX_INTERVAL).toFixed(0);
        this.broadcast = broadcast ?? generateRandomStandardString();
        debug(`noise interval time: ${this.interval} ms.`);
        this.timeOut = setTimeout(this.onTimeOut.bind(this), this.interval);
    }

    stopNoise() {
        clearTimeout(this.timeOut);
    }
}

module.exports = {
    NoiseBroadcastClient,
}