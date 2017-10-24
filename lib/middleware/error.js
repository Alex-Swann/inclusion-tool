'use strict';

const path = require('path');
const hof = require('hof');
const i18n = hof.i18n({
  path: path.join(__base, 'apps/common/translations/__lng__/__ns__.json')
});
const config = require(path.join(__base, 'config'));
const logger = require('../logger');
const debug = require('debug')('rt:error');
const _ = require('lodash');

/*eslint-disable no-unused-vars */
module.exports = function errorHandler(err, req, res, next) {

  if (res.locals && res.locals.signOutLink) {
    res.locals.signOutLink = false;
  }

  // hmpo-form-controller errors have a redirect
  if (err.redirect) {
    debug(err.redirect);
    req.sessionModel.set('errors', err);
    return res.redirect(err.redirect);
  }

  // hmpo-form-controller errors can also have a template defined, but if not, we should use our default
  _.defaults(err, {'template': 'error'});

  /*eslint-enable no-unused-vars */
  let content = {};

  if (err.code === 'SESSION_TIMEOUT') {
    content.title = i18n.translate('errors.session.title');
    content.message = i18n.translate('errors.session.message');
  }

  if (err.code === 'NO_COOKIES') {
    err.status = 403;
    content.title = i18n.translate('errors.cookies-required.title');
    content.message = i18n.translate('errors.cookies-required.message');
  }

  // Doing this last, in case translation is slow
  _.defaults(content, {
    'title': i18n.translate('errors.default.title'),
    'message': i18n.translate('errors.default.message')
  });

  res.statusCode = err.status || 500;
  logger.error(err.message || err.error, err);

  res.render(err.template, {
    error: err,
    content: content,
    showStack: config.env === 'development',
    startLink: req.path.replace(/^\/([^\/]*).*$/, '$1')
  });
};
