'use strict';

/**
 * @param config
 * @returns {{secureCookies: (*|exports|module.exports), cookieParser: *, initSession: *}}
 */

module.exports = function sessionLayer(config) {
  return {
    secureCookies: require('./secure-cookies'),
    cookieParser: require('./init-cookie-parser')(config),
    initSession: require('./session-layer')(config)
  };
};
