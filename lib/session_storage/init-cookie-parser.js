'use strict';

module.exports = function cookieParser(config) {
  return require('cookie-parser')(config.session.secret);
};
