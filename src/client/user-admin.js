import './user-admin.sass';
import { sockets, connectSecureSocket } from './socket';
import { message } from './message';
import { getJsonFromUrl } from './getJsonFromUrl';

const $loginForm = document.querySelector('.login');
const $newPasswordForm = document.querySelector('.new-password');
const getParameters = getJsonFromUrl();

// User management function
let userList = [];
const $user = document.querySelector('.user');
const $userList = $user.querySelector('.user__list');

document.querySelector('.nav__login').addEventListener('click', () => {
	$loginForm.style.display = 'flex';
});

$loginForm.addEventListener('click', () => {
	$loginForm.style.display = 'none';
});
$loginForm.children[0].addEventListener('click', event => {
	event.stopPropagation();
});

sockets.default.on('bad token', data => {
	localStorage.removeItem('credentials');
	message(data);
});

sockets.default.on('logged out', () => {
	localStorage.removeItem('credentials');
	document.querySelectorAll('.app--logged-out').forEach(el => {
		el.style.display = 'flex';
	});
	document.querySelectorAll('.app--logged-in').forEach(el => {
		el.style.display = 'none';
	});
});

sockets.default.on('logged in', data => {
	message({ success: `Your are logged in <b>${data.username}</b>.` });
	if (data.sessionId) {
		const { sessionId, sessionToken } = data;
		localStorage.credentials = JSON.stringify({ sessionToken, sessionId });
	}

	document.querySelectorAll('.app--logged-in').forEach(el => {
		el.style.display = 'flex';
	});
	document.querySelectorAll('.app--logged-out').forEach(el => {
		el.style.display = 'none';
	});
	if (sockets.secure.disconnected) {
		connectSecureSocket();
		sockets.secure.on('disconnect', () => {
			message({ error: 'Secure socket disconnected. Please reload.' });
			// $loginForm.style.display = 'flex';
		});
		// sockets.secure.on('update tweet', ({ index, tweet }) => {
		// 	const $el = document.querySelector(`.tweet[data-id="${index}"]`);
		// 	if ($el) $el.outerHTML = renderTweet(Object.assign(tweet, { index }));
		// });
	}
	$loginForm.style.display = 'none';
});

// Login with session token if available
sockets.default.on('connect', () => {
	if (localStorage.credentials) {
		sockets.default.emit('login with sessionToken', JSON.parse(localStorage.credentials));
	}
});

// Connect the login form to login over the socket
$loginForm.addEventListener('submit', event => {
	event.preventDefault();
	const username = event.target.elements.username.value;
	const password = event.target.elements.password.value;
	sockets.default.emit('login with password', { username, password });
});

function logout() {
	if (!sockets.secure.disconnected) sockets.secure.emit('logout');
}
// Log out: send logout to server and delete credentials
document.querySelector('.nav__logout').addEventListener('click', logout);

function renderUser({ username, hasRegistrationToken, registrationToken }) {
	let registration = hasRegistrationToken ? '<i>(pending)</i>' : '';
	registration = registrationToken ? `<a href="?username=${username}&registrationToken=${registrationToken}">(⎘ registration link)</a>` : registration;
	return `<div class="card-1 ${hasRegistrationToken ? 'user--not-registerd' : ''} ${registrationToken ? 'user--has-reg-token' : ''}">
		<span>${username} ${registration}</span>
		<div class="user__menu" data-username="${username}">
			<span data-fkt="reset" title="Reset user login.">↻</span>
			<span data-fkt="delete" title="Delete this user.">❌</span>
		</div>
	</div>`;
}

$user.querySelector('.user__close').addEventListener('click', () => {
	$user.style.display = 'none';
});

document.querySelector('.nav__user-list').addEventListener('click', event => {
	event.stopPropagation();
	if (userList.length) {
		$user.style.display = 'flex';
		return;
	}
	sockets.secure.emit('list users', null, data => {
		if (data.error) return message(data.error);
		$user.style.display = 'flex';
		({ userList } = data);
		userList.forEach(user => {
			$userList.innerHTML += renderUser(user);
		});
	});
});

$user.querySelector('form').addEventListener('submit', event => {
	event.preventDefault();
	const username = event.target.elements.username.value;
	if (!username) return message({ error: 'Please fill in a username.' });
	sockets.secure.emit('create registration token', { username }, data => {
		if (data.error) return message(data);
		event.target.elements.username.value = '';
		$userList.innerHTML += renderUser(data.user);
		userList.push(data.user);
	});
});

$userList.addEventListener('click', event => {
	if (event.target.hasAttribute('data-fkt')) {
		const { username } = event.target.parentElement.dataset;
		const { fkt } = event.target.dataset;
		({
			reset() {
				if (confirm('Reset password and create new registration token?')) {
					sockets.secure.emit('create registration token', { username }, data => {
						if (data.error) return message(data);
						$userList.querySelector(`[data-username="${username}"]`).parentElement.outerHTML = renderUser(data.user);
					});
				}
			},
			delete() {
				if (confirm(`Delete user ${username}?`)) {
					sockets.secure.emit('delete user', { username }, data => {
						if (data.error) return message(data);
						$userList.querySelector(`[data-username="${username}"]`).parentElement.remove();
					});
				}
			},
		}[fkt]());
	}
});

$newPasswordForm.addEventListener('submit', event => {
	event.preventDefault();
	const password = event.target.elements.password1.value;
	const password2 = event.target.elements.password2.value;
	if (password !== password2) return message({ error: 'Passwords did not match.' });
	sockets.default.emit('register', Object.assign({ password }, getParameters), data => {
		message(data);
		if (data.error) return;
		window.history.replaceState({}, document.title, '/');
		$newPasswordForm.style.display = 'none';
		$loginForm.querySelector('[name="username"]').value = getParameters.username;
		$loginForm.style.display = 'flex';
	});
});

if (getParameters.registrationToken && getParameters.username && !localStorage.credentials) {
	sockets.default.emit('is registration token active', getParameters, ({ isRegistrationActive }) => {
		if (isRegistrationActive) {
			logout();
			$newPasswordForm.style.display = 'flex';
		} else {
			window.history.pushState({}, document.title, '/');
			message({ error: 'Your registration token is not valid any more.' });
		}
	});
}
