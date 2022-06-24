const host = '127.0.0.1';

const httpServer = require('./http-server');
const msnServer = require('./msn-server');

httpServer.start(443,host);
msnServer.start(1863,host);