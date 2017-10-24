'use strict';

var winston = require('winston');
var config = require('../config');
var loggingTransports = [];
var exceptionTransports = [];
var notProd = (config.env === 'development' || config.env === 'dev' || config.env === 'test' || config.env === 'ci');
var levels = {
  error: 0,
  warn: 1,
  info: 2,
  email: 3,
  debug: 4
};
var colors = {
  debug: 'blue',
  info: 'green',
  email: 'magenta',
  warn: 'yellow',
  error: 'red'
};

loggingTransports.push(
  new (winston.transports.Console)({
    json: false,
    timestamp: true,
    colorize: true,
    stringify: function stringify(obj) {
      return JSON.stringify(obj);
    }
  })
);

exceptionTransports.push(
  new (winston.transports.Console)({
    json: false,
    timestamp: true,
    colorize: true,
    stringify: function stringify(obj) {
      return JSON.stringify(obj);
    }
  })
);

// Shut up mocha!
if (config.env === 'test') {
  loggingTransports = [];
}

var transports = {
  levels: levels,
  transports: loggingTransports,
  exceptionHandlers: exceptionTransports,
  exitOnError: true
};

if (notProd) {
  delete transports.exceptionHandlers;
}

var logger = new (winston.Logger)(transports);

winston.addColors(colors);

module.exports = logger;
