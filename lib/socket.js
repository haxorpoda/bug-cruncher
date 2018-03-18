const { http } = require('./http');

module.exports = {
	io: require('socket.io')(http),
};
