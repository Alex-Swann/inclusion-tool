'use strict';

var session = require('express-session');
var mongoConnect = require('connect-mongo');

module.exports = function mongoConnector(config) {
  var MongoStore = mongoConnect(session);
  return new MongoStore({
    secret: config.session.secret,
    url: config.mongo.connectionString,
    ttl: config.session.ttl,
    stringify: false
  });
};
