const express = require("express");
const cors_proxy = require('cors-anywhere');

const PORT = process.env.PORT || 3000;
const PROXY_HOST = process.env.PROXY_HOST || "localhost";
const PROXY_PORT = process.env.PROXY_PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.listen(PORT, () => {
    console.log("Server is now listening on port: " + PORT);
});

cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(PROXY_PORT, PROXY_HOST, function() {
    console.log('Running CORS Anywhere on ' + PROXY_HOST + ':' + PROXY_PORT);
});