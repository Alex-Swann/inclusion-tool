'use strict';

module.exports = function secureCookies(req, res, next) {
  let cookie = res.cookie.bind(res);
  res.cookie = function cookieHandler(name, value, options) {
    options = options || {};
    /* eslint-disable no-process-env */
    options.secure = process && process.env && process.env.NODE_ENV && process.env.NODE_ENV !== 'development';
    /* eslint-enable no-process-env */
    options.httpOnly = true;
    options.path = '/';
    cookie(name, value, options);
  };
  next();
};

