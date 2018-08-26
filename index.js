const http = require('http');
const config = require('./config');
const url = require('url');

const httpServer = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    const path = parsedUrl.pathname;
    let trimmedUrl = path;
    if (trimmedUrl.endsWith('/')) trimmedUrl = trimmedUrl.substring(0, trimmedUrl.length - 1);
    if (trimmedUrl.startsWith('/')) trimmedUrl = trimmedUrl.substring(1, trimmedUrl.length);

    const routeHandler = typeof(routes[trimmedUrl]) !== 'undefined' ? routes[trimmedUrl] : handlers.notFound;
    console.log(typeof(routes[trimmedUrl]));

    routeHandler({}, (statusCode, data) => {
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(JSON.stringify(data));
    });
});

httpServer.listen(config.httpPort, (err) => {
    if (err) return console.log(err);
    console.log(`Server running on ${config.httpPort}`);
});

const handlers = {};

handlers.notFound = (data, callback) => {
    callback(404,{message: "404 Not Found."});
}

handlers.hello = (data, callback) => {
    callback(200, {message: "Hello World."});
};

const routes = {
    'hello': handlers.hello,
}