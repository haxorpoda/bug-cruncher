#!/usr/bin/env node
/* eslint-disable no-param-reassign, no-unused-expressions */
const { express, app, http } = require('./lib/http');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { authenticatedSockets } = require('./lib/user');
const { io } = require('./lib/socket');
const images = require('./server-data/thumbs.index.json');

// ###########################
const dataDir = 'server-data';
// ###########################

const selectionsDb = low(new FileSync(`${dataDir}/selections.json`));
selectionsDb.defaults([]).write();
images.forEach(image => {
	[image.id] = image.fileName.split('.');
});

const userSessionData = {};

function prevNext(by, session, socket) {
	socket.leave(images[session.index].id);
	session.index += by;
	socket.emit('load image', images[session.index]);
	const selections = selectionsDb.get(`${images[session.index].id}.selections`).value();
	socket.emit('update selections', selections || []);
	socket.join(images[session.index].id);
}

io.on('connection', socket => {
	userSessionData[socket.id] = { id: images[0].id, index: 0 };
	prevNext(0, userSessionData[socket.id], socket);

	socket.on('next', () => {
		const session = userSessionData[socket.id];
		if (session.index + 1 < images.length) {
			prevNext(1, session, socket);
		} else {
			io.to(socket.id).send({ error: 'You have reached the last item.' });
		}
	});

	socket.on('prev', () => {
		const session = userSessionData[socket.id];
		if (session.index > 0) {
			prevNext(-1, session, socket);
		} else {
			io.to(socket.id).send({ error: 'You are at the first item.' });
		}
	});
});

io.of('/secure').on('connection', socket => {
	let selections;
	socket.on('add selection', ({ imageId, data }) => {
		data.username = authenticatedSockets[socket.id].username;
		console.log("authenticatedSockets[socket.id]", authenticatedSockets[socket.id]);
		if (
			!selectionsDb
				.read()
				.has(imageId)
				.value()
		) {
			selections = [data];
			selectionsDb.set(imageId, { selections }).write();
		} else {
			selectionsDb
				.get(`${imageId}.selections`)
				.push(data)
				.write();
			selections = selectionsDb.get(`${imageId}.selections`).value();
		}
		io
			.of('/')
			.to(imageId)
			.emit('update selections', selections);
	});
	socket.on('delete selection', ({ imageId, index }) => {
		selectionsDb.get(`${imageId}.selections`).remove((a, _index) => _index === index).write();
		selections = selectionsDb.get(`${imageId}.selections`).value();
		io
			.of('/')
			.to(imageId)
			.emit('update selections', selections);
	});
});

app.use(express.static('public'));
app.use('/thumbs', express.static('./data/thumbs'));

const port = process.env.PORT || 3003;
http.listen(port, () => {
	process.stdout.write(`\nlistening on *: ${port}\n`);
});
