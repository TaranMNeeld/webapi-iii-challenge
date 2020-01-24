// require('dotenv').config()

const server = require("./server");

const port = 7000;

server.listen(port, () => console.log('\nserver running\n', port));