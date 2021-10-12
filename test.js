'use strict'
const $server = new (require('./server.js')).base();


$server.add('hello', function(){
     return 'bello';
});
