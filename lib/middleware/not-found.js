'use strict';

const path = require('path');
/*eslint-disable no-undef */
const i18n = require('hof').i18n({
  path: path.join(__base, 'apps/common/translations/__lng__/__ns__.json')
});
const logger = require('../logger');
const config = require(path.join(__base, 'config'));
/*eslint-enable no-undef */

module.exports = function notFoundHandler(req, res) {
  if (res.locals && res.locals.signOutLink) {
    res.locals.signOutLink = false;
  }

  logger.warn('Navigation to incorrect path:', req.url);
  res.status(404);
  res.render('404', {
    title: i18n.translate('errors.notFound.title'),
    message: i18n.translate('errors.notFound.message'),
    startLink: config.govUkHomePage
  });
};
