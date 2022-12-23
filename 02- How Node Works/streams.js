const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
  //Solution 1
  // fs.readFile('./test-file.txt', 'utf8', (err, data) => {
  //   if (err) console.log('Error ', err);
  //   res.end(data);
  // });

  //Solution 2 : Streams
  // const readable = fs.createReadStream('./test-file.txt');
  // readable.on('data', (chunk) => {
  //   res.write(chunk);
  // });

  // readable.on('end', () => {
  //   res.end();
  // });

  // readable.on('error', (err) => {
  //   console.log(err);
  //   res.statusCode = 500;
  //   res.end('File not found');
  // });

  //Solution 3 : Pipe
  const readable = fs.createReadStream('./test-file.txt');
  readable.pipe(res);
  // readableSource.pipe(writeableDest)
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
