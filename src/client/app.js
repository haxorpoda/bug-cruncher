import jsQR from 'jsqr';

import './app.sass';
import { sockets } from './socket';
import { message } from './message';
import './user-admin';

const $app = document.querySelector('.app');
const $selections = document.querySelector('.selections');
const $qrcode = document.querySelector('.qrcode');
const context = document.querySelector('.canvas1').getContext('2d');
let scaleFactor = 0;
let shiftPressed = false;
let currentImage = {};
let start;
const selectionRectangles = [];
const oldSelections = [];

// Script is loaded, now remove the splash and render the real content.
document.querySelector('main').style.display = 'block';
document.querySelector('.splash').style.display = 'none';

sockets.default.on('load image', data => {
	currentImage = data;
	const { width, height, fileName } = data;
	const { clientWidth, clientHeight } = document.body;
	scaleFactor = height / clientHeight;
	if (clientWidth * scaleFactor < width) {
		scaleFactor = width / clientWidth;
	}
	context.canvas.width = width;
	context.canvas.height = height;

	const img1 = new Image();
	img1.onload = () => {
		context.drawImage(img1, 0, 0);
	};
	img1.src = `thumbs/${fileName}`;
	$app.style.backgroundImage = `url('${img1.src}')`;
});

$selections.addEventListener('click', event => {
	event.stopPropagation();
	if (!event.target.getAttribute('data-index')) return;
	sockets.secure.emit(
		'delete selection',
		{ imageId: currentImage.id, index: parseInt(event.target.dataset.index, 10) }
	);
});

sockets.default.on('update selections', data => {
	$selections.innerHTML = '';
	data.forEach(({ selection, code, username }, index) => {
		if (!selection) return;
		const $selectRect = document.createElement('div');
		$selectRect.innerHTML = `<div data-index="${index}" class="selection__delete">❌</div>`;
		if (code) $selectRect.innerHTML += `<div class="selection__code">${code}</div>`;
		if (username) $selectRect.innerHTML += `<div class="selection__username">${username}</div>`;
		oldSelections.unshift($selectRect);
		$selections.prepend($selectRect);
		$selectRect.classList.add('old-selection');
		Object.assign($selectRect.style, {
			left: `${selection.x / scaleFactor}px`,
			top: `${selection.y / scaleFactor}px`,
			width: `${selection.w / scaleFactor}px`,
			height: `${selection.h / scaleFactor}px`,
		});
	});
});

const next = () => sockets.default.emit('next');
const prev = () => sockets.default.emit('prev');
document.querySelector('.nav__back').addEventListener('click', prev);
document.querySelector('.nav__next').addEventListener('click', next);
document.querySelector('.menu div').addEventListener('click', event => {
	event.stopPropagation();
})
// ## Mouse drag and drop
function onMouseMove(event) {
	Object.assign(selectionRectangles[0].style, {
		height: `${event.clientY - start.y}px`,
		width: `${event.clientX - start.x}px`,
	});
}
document.body.addEventListener('mousedown', event => {
	if (!start) {
		if (!shiftPressed) selectionRectangles.forEach(el => el.remove());

		const $selectRect = document.createElement('div');
		selectionRectangles.unshift($selectRect);
		document.body.prepend($selectRect);
		$selectRect.classList.add('selection-rectangle');

		start = { x: event.clientX, y: event.clientY };
		Object.assign($selectRect.style, {
			left: `${event.clientX}px`,
			top: `${event.clientY}px`,
		});
		document.body.addEventListener('mousemove', onMouseMove);
	}
});
function renderSlice(imgData) {
	const context2 = document.querySelector('.canvas2').getContext('2d');
	context2.canvas.width = imgData.width;
	context2.canvas.height = imgData.height;
	// const newImageData = binarizeImage(contrastImage(imgData, 50));
	// const newImageData = binarizeImage(imgData);
	context2.putImageData(imgData, 0, 0);
	return imgData;
}
function getQRcode(imgData) {
	const code = jsQR(imgData.data, imgData.width, imgData.height);
	if (code) {
		$qrcode.innerHTML = code.data;
		return code;
	}
	$qrcode.innerHTML = 'no qr code found';
}
document.body.addEventListener('mouseup', event => {
	document.body.removeEventListener('mousemove', onMouseMove);
	const { width, height } = selectionRectangles[0].style;
	const area = parseInt(width, 10) * parseInt(height, 10);
	if (isNaN(area) || area < 200) {
		// message({ error: 'Please select a larger area.' });
		start = null;
		return;
	}
	const w = width.slice(0, width.length - 2) * scaleFactor;
	const h = height.slice(0, height.length - 2) * scaleFactor;
	const x = start.x * scaleFactor;
	const y = start.y * scaleFactor;

	start = null;

	if (sockets.secure.disconnected) return message({ error: 'Please log in to start.' });

	if (!(h && w)) return;

	const imgData = context.getImageData(x, y, w, h);
	// renderSlice(imgData);
	const qrData = getQRcode(imgData);
	sockets.secure.emit('add selection', {
		imageId: currentImage.id,
		data: { code: qrData ? qrData.data : undefined, selection: { x, y, h, w } },
	});
});

function contrastImage(imgData, contrast) {
	// input range [-100..100]
	const d = imgData.data;
	contrast = contrast / 100 + 1; // convert to decimal & shift range: [0..2]
	const intercept = 128 * (1 - contrast);
	for (let i = 0; i < d.length; i += 4) {
		// r,g,b,a
		d[i] = d[i] * contrast + intercept;
		d[i + 1] = d[i + 1] * contrast + intercept;
		d[i + 2] = d[i + 2] * contrast + intercept;
	}
	return imgData;
}

function binarizeImage(imageData) {
	const buffer = imageData.data;
	const len = buffer.length;
	const threshold = 127;
	let i = 0;
	let lum;

	for (; i < len; i += 4) {
		lum = buffer[i] * 0.3 + buffer[i + 1] * 0.59 + buffer[i + 2] * 0.11;
		lum = lum < threshold ? 0 : 255;
		buffer[i] = lum;
		buffer[i + 1] = lum;
		buffer[i + 2] = lum;
	}

	return imageData;
}

// ## Keyboad shortcuts
window.addEventListener('keydown', event => {
	if (event.key === 'ArrowRight') next();
	if (event.key === 'ArrowLeft') prev();
	if (event.key === 'Escape') {
		selectionRectangles.forEach(el => el.remove());
		context.clearRect(0, 0, 9999, 9999);
		$qrcode.innerHTML = '';
	}
	if (event.shiftKey) shiftPressed = true;
});
window.addEventListener('keyup', event => {
	if (!event.shiftKey) shiftPressed = false;
});
