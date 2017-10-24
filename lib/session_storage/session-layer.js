'use strict';

var session = require('express-session');

var connectors = {
  cookie: './connectors/cookie',
  mongo: './connectors/mongo'
};

module.exports = function returnSessionLayer(config) {
  var connector = config.session.connector;

  if (connector === 'cookie') {
    return require(connectors[connector])({
      cookieName: 'session',
      secret: config.session.secret,
      duration: config.session.ttl * 1000,
      activeDuration: config.session.ttl * 1000,
      cookie: {
        path: '/',
        ephemeral: true,
        httpOnly: true
      }
    });
  }

  return session({
    store: require(connectors[connector])(config),
    /* eslint-disable no-process-env */
     cookie: {
      secure: process && process.env && process.env.NODE_ENV && process.env.NODE_ENV !== 'development'
    },
    /* eslint-enable no-process-env */
    key: config.session.cookieKey,
    secret: config.session.secret,
    resave: true,
    saveUninitialized: true
  });
};
