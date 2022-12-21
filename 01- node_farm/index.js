const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

/*

* FILES: SYNC AND ASYNC

// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `This is what we know about avocado: ${textIn}.\nCreated on ${new Date().toDateString()}`;
// fs.writeFileSync('./txt/output.txt', textOut);

 
//Non-Blocking , Asynchronous way.
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if(err) return console.log("Error Occurred", err.message);
//   console.log(data1);
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//       const outputData = `${data2}\n${data3}`;
//       fs.writeFile('./txt/output.txt', outputData, (err) => {
//       if(err) return console.log("Error Occurred", err.message);
      
//       console.log("Output file created");
//     });
//     });
//   });
// });
// console.log("Reading File Start");
 */
// * Creating simple web server using http

//Make used variables outside the requests to save the server overhead.
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

// const slugs = dataObj.map((p) => slugify(p.productName, { lower: true }));
// console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  switch (pathname) {
    //Overview Page
    case '/':
    case '/overview':
      res.writeHead(200, {
        'Content-Type': 'text/html',
      });

      const cards = dataObj.map((p) => replaceTemplate(tempCard, p)).join('');
      const products = tempOverview.replace('{%PRODUCT_CARDS%}', cards);
      return res.end(products);

    //Product Page
    case '/product':
      res.writeHead(200, {
        'Content-Type': 'text/html',
      });

      const product = dataObj[query.id];
      const card = replaceTemplate(tempProduct, product);
      return res.end(card);

    //API
    case '/api':
      res.writeHead(200, {
        'Content-Type': 'application/json',
      });
      return res.end(data);

    //Not Found
    default:
      res.writeHead(404, {
        'Content-Type': 'text/html',
        'My-OWN-HEADER': 'Hello World!',
      });
      return res.end('<h1>This Page Not Found!</h1>');
  }
});

server.listen(3000, '127.0.0.1', () => {
  console.log('listening on http://127.0.0.1:3000');
});
