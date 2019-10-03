const express = require('express');
const helmet = require("helmet");

const server = express();

const userRouter = require('./users/userRouter.js');

function logger(req, res, next) {
    const method = req.method;
    const url = req.url;
    const timestamp = Date.now();
    console.log(`a ${method} request was sent to ${url} at ${timestamp}`);
    next();
}

server.use(express.json());
server.use(helmet());
server.use(logger);
server.use('/users', userRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

module.exports = server;
