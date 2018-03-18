import './message.sass';

// Display messages with error and success syle.
// `messageObject` Examples:
// ```
// {error: 'Error message with <b>style</b>.'}
// {success: 'Success message.'}
// ```
export function message(messageObject) {
	if (!(messageObject.error || messageObject.success)) return;
	const $message = document.createElement('div');
	[$message.innerHTML] = Object.values(messageObject);
	$message.classList.add(Object.keys(messageObject)[0]);
	document.querySelector('.messages').appendChild($message);
	setTimeout(() => {
		$message.remove();
	}, 3000);
}
