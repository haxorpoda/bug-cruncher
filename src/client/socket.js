import _io from 'socket.io-client';
import { message } from './message';

export const io = _io;
export const host = 'http://localhost:3003';
export const defaultSecureSocket = {
	disconnected: true,
	emit() {
		message({ error: 'Request failed, please log in.' });
	},
	on(/*...args*/) {
		message({ error: `This function should remember the inputs
			and bind them to the real "on" function
			once the socket is really conencted. If you see this output
			it means this must be implemented.` });
	},
};
export const sockets = {
	default: io(host),
	secure: defaultSecureSocket,
};
sockets.default.on('message', message);
export function connectSecureSocket() {
	sockets.secure = io(`${host}/secure`);
	sockets.secure.on('disconnect', (data) => {
		message(data);
		sockets.secure = defaultSecureSocket;
	});
}

