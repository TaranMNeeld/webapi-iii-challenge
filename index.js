const express = require('express');

const postRouter = require('./posts/postRouter.js');
const userRouter = require('./users/userRouter.js');

const server = express();

function logger(req, res, next) {
    const method = req.method;
    const url = req.url;
    const timestamp = Date.now();
    console.log(`a ${method} request was sent to ${url} at ${timestamp}`);
    next();
}

server.use(express.json());
server.use(logger);
server.use('/posts', postRouter);
server.use('/users', userRouter);

const port = 8000;
server.listen(port, () => console.log('\nserver running\n'));