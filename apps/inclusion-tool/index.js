  'use strict';

var hof = require('hof');
var wizard = require('hof-form-wizard');
var mixins = hof.mixins;
var i18nFuture = hof.i18n;
var router = require('express').Router();
var path = require('path');
var _ = require('lodash');
const config = require('../../config');

var fields = _.extend({}, require('../common/fields/'), require('./fields/'));
var i18n = i18nFuture({
  path: path.resolve(__dirname, './translations/__lng__/__ns__.json')
});

router.use((req, res, next) => {
  res.locals.stylesheet = 'guide-app.css';
  next();
});

router.use(mixins(fields, {
  translate: i18n.translate.bind(i18n),
  viewsDirectory: `${__dirname}/../common/views/`
}));

router.use(config.products['inclusion-tool'].startPage, wizard(require('./steps'), fields, {
  templatePath: path.resolve(__dirname, 'views'),
  translate: i18n.translate.bind(i18n),
  name: 'inclusion-tool',
  params: '/:action?'
}));

router.use(config.products['inclusion-tool'].startPage, require('../../lib/middleware/version'));

module.exports = router;
