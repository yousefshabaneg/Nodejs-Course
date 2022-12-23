/*Wrapper Function: all our code is wrapped into an iife funciton to make its variables protected from global scope, and it have 5 arguments: 
wrapper: function(exports, require, module, __filename, __dirname)
{
  //Module code lives here
}
// console.log(require('module').wrapper);
*/

//modules.exports
// const C = require('./test-module-1');
// const calc1 = new C();
// console.log(calc1.add(1, 2));

//exports
// cxonst calc2 = require('./test-module-2');
// const { add, multiply } = require('./test-module-2');

// console.log(calc2.add(5, 2));
// console.log(add(5, 2));
// console.log(multiply(5, 2));

//Caching: The module is loaded only once, so any top-level logs will be printed only once
require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();
