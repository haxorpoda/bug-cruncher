const express = require('express');

const app = express();
const http = require('http').Server(app);

module.exports = {
	express,
	app,
	http,
};
