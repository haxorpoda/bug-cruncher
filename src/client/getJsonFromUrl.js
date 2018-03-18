export function getJsonFromUrl() {
	return window.location.search
		.substr(1)
		.split('&')
		.reduce((acc, part) => {
			const item = part.split('=');
			return Object.assign(acc, { [item[0]]: decodeURIComponent(item[1]) });
		}, {});
}
