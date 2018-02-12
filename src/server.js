#!/usr/bin/env node
const Path = require('path');
const Fs = require('fs');
const Hapi = require('hapi');
const Inert = require('inert');

// Create a server with a host and port
const server = Hapi.server({
    host: 'localhost',
    port: 8001,
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        // return 'hello world';
        return h.file(`${__dirname}/../public/index.html`);
    },
});

server.route({
    method: 'POST',
    path: '/save',
    handler: function(request, h) {
        const data = JSON.parse(request.payload);
        // console.log("data", data);
        const tweetsPath = './public/tweets.json';
        const tweets = require(tweetsPath);
        console.log("tweets[data.id]", tweets[data.id]);
        Object.assign(tweets[data.id], data);
        Fs.writeFileSync(tweetsPath, JSON.stringify(tweets, null, 2));
        // process.stdout.write(`\nFound ${tweets.length} items\n`);
        return tweets;
    },
});

// Start the server
async function start() {
    try {
        await server.register(Inert);
        server.route({
            method: 'GET',
            path: '/{param*}',
            handler: {
                directory: {
                    path: `${__dirname}/../public`,
                    listing: true,
                },
            },
        });
        await server.start();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
}

start();
