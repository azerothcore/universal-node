// !!!DO NOT EDIT!!!
// this file is the bootstrap code
// that allows,  together with .babelrc, import/export ES6 syntax
// working on nodejs via babel.
// Waiting for full nodejs support.

require("../../apps/installer/installer")

require('dotenv').config();

require('module-alias/register');

require("@babel/register")({})


// Import the rest of our application.
module.exports = require('./server.js')