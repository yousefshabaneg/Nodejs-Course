const EventEmitter = require('events');
const http = require('http');

class Sales extends EventEmitter {
  constructor() {
    super();
    this.sales = [];
  }
}

const myEmitter = new Sales();

myEmitter.on('newSale', () => {
  console.log('There was a new sale');
});

myEmitter.on('newSale', () => {
  console.log('Customer name: Yousef Shaban');
});

myEmitter.on('newSale', (stock) => {
  console.log(`There are now ${stock} items left in stock.`);
});

myEmitter.emit('newSale', 9);

////////////////////////////////

const server = http.createServer();

server.on('request', (req, res) => {
  console.log(`Request Received: ${req.method} ${req.url}`);
  res.end('Request Received');
});

server.on('request', (req, res) => {
  console.log('Another Request');
});

server.on('close', (req, res) => {
  console.log('Server Closed');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
