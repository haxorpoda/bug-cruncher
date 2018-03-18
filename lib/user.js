const securePassword = require('secure-password');
const uuidv4 = require('uuid/v4');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { io } = require('./socket');

// ###########################
const dataDir = 'server-data';
// ###########################

// Initialise the password policy
const pwd = securePassword();

const userDb = low(new FileSync(`${dataDir}/users.json`));
userDb.defaults({}).write();

const sessionDb = low(new FileSync(`${dataDir}/sessions.json`));
sessionDb.defaults({}).write();

const authenticatedSockets = {};

io.on('connection', socket => {
	// Login with username: if sucessfull return a session token and
	// store the secure hash token in the user db.
	socket.on('login with password', ({ username, password }) => {
		const user = userDb
			.read()
			.get(username)
			.value();
		if (!user || !user.passwordHash) return io.to(socket.id).send({ error: 'Username or password wrong.' });
		const result = pwd.verifySync(Buffer.from(password), Buffer.from(user.passwordHash.data));
		if (result === securePassword.INVALID) return io.to(socket.id).send({ error: 'Username or password wrong.' });
		if (result === securePassword.VALID) {
			const sessionId = uuidv4();
			const sessionToken = uuidv4();
			const sessionTokenHash = pwd.hashSync(Buffer.from(sessionToken));
			sessionDb.set(sessionId, { sessionTokenHash, username }).write();
			authenticatedSockets[`/secure#${socket.id}`] = { sessionId, socketId: socket.id, username };
			io.to(socket.id).emit('logged in', { sessionToken, sessionId, username, success: true });
			// cb && cb({ sessionToken, sessionId, success: true });
		}
	});

	// Login with session token: check if the user has a matching token in the db.
	socket.on('login with sessionToken', ({ sessionId, sessionToken }) => {
		const session = sessionDb
			.read()
			.get(sessionId)
			.value();
		if (!session) return io.to(socket.id).emit('bad token', { error: 'Username or token wrong.' });
		const result = pwd.verifySync(Buffer.from(sessionToken), Buffer.from(session.sessionTokenHash.data));
		if (result === securePassword.INVALID) return io.to(socket.id).emit('bad token', { error: 'Unknown token.' });
		if (result === securePassword.VALID) {
			authenticatedSockets[`/secure#${socket.id}`] = { sessionId, socketId: socket.id, username: session.username };
			io.to(socket.id).emit('logged in', { success: true, username: session.username });
		}
	});

	socket.on('is registration token active', ({ username }, cb) => {
		const isRegistrationActive = userDb
			.read()
			.has(`${username}.registrationTokenBuffer`)
			.value();
		cb && cb({ isRegistrationActive });
	});

	// Register: Create a new user entry and calculate a secure password hash.
	socket.on('register', ({ username, password, registrationToken }, cb) => {
		if (password.length < 8) return cb && cb({ error: 'Password too short.' });
		const registrationTokenBuffer = userDb
			.read()
			.get(`${username}.registrationTokenBuffer.data`)
			.value();
		if (!registrationTokenBuffer) return cb && cb({ error: 'Username or token wrong.' });
		const result = pwd.verifySync(Buffer.from(registrationToken), Buffer.from(registrationTokenBuffer));
		if (result === securePassword.INVALID) return cb && cb({ error: 'Username or token wrong.' });
		if (result === securePassword.VALID) {
			const passwordHash = pwd.hashSync(Buffer.from(password));
			userDb
				.set(username, { passwordHash })
				.unset(`${username}.registrationTokenBuffer`)
				.write();
			// TODO add broadcast here
			cb && cb({ success: `Registered new user <b>${username}</b>.` });
		}
	});
});

function removeSessionsByUsername(username) {
	sessionDb
		.entries()
		.filter(([, value]) => value.username === username)
		.map(([sessionId]) => sessionId)
		.value()
		.forEach(sessionId => {
			sessionDb.unset(sessionId).write();
		});
}

io.of('/secure').on('connection', socket => {
	if (!(socket.id in authenticatedSockets)) {
		socket.emit('not authenticated');
		socket.disconnect();
	}

	// Logout: Remove authenticated flag and delete the session token.
	socket.on('logout', () => {
		const { sessionId, socketId } = authenticatedSockets[socket.id];
		removeSessionsByUsername(sessionDb.get(`${sessionId}.username`).value());
		delete authenticatedSockets[socket.id];
		io.to(socketId).emit('logged out');
	});

	// Create registration token
	socket.on('create registration token', ({ username }, cb) => {
		const registrationToken = uuidv4();
		const registrationTokenBuffer = pwd.hashSync(Buffer.from(registrationToken));
		userDb.set(username, { registrationTokenBuffer }).write();
		userDb.unset(`${username}.passwordHash`).write();
		// TODO add broadcast here
		removeSessionsByUsername(username);
		cb && cb({ success: 'Edit success.', user: { username, registrationToken, hasRegistrationToken: true } });
	});

	// Delete a user
	socket.on('delete user', ({ username }, cb) => {
		userDb.unset(username).write();
		// TODO add broadcast here
		cb && cb({ success: 'Delete success.' });
	});

	// List all users
	socket.on('list users', (data, cb) => {
		cb &&
			cb({
				userList: userDb
					.read()
					.entries()
					.value()
					.map(([username, { registrationTokenBuffer }]) => ({ username, hasRegistrationToken: !!registrationTokenBuffer })),
			});
	});
});

module.exports = {
	authenticatedSockets,
}
