// * Event-Loop
const fs = require('fs');
const crypto = require('crypto');

const start = Date.now();

process.env.UV_THREADPOOL_SIZE = 2; //CHANGE THREADS IN THREAD POOL: DEFAULT IS {4}

console.log('Top-Level Code Started');

setTimeout(() => console.log('Timer 1 Finished'), 0);
setImmediate(() => console.log('Immediate 1 Finished'));

fs.readFile('./test-file.txt', 'utf-8', (err, data) => {
  console.log('File I/O Finished');
  console.log('-----------------');

  setTimeout(() => console.log('Timer 2 Finished'), 0);
  setTimeout(() => console.log('Timer 3 Finished'), 3000);
  setImmediate(() => console.log('Immediate 2 Finished'));

  process.nextTick(() => console.log('Process.NextTick'));
});

crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', (err, key) => {
  console.log('Password Hashed');
  console.log(Date.now() - start);
});

crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', (err, key) => {
  console.log('Password Hashed');
  console.log(Date.now() - start);
});

crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', (err, key) => {
  console.log('Password Hashed');
  console.log(Date.now() - start);
});

crypto.pbkdf2Sync('password', 'salt', 100000, 1024, 'sha512');
console.log('Sync Thread: ', Date.now() - start);

console.log('Top-Level Code Finished');
