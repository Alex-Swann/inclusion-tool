'use strict';
/* eslint no-console: 0 */
var express = require('express');
var app = express();

var path = require('path');
var config = require('./config');
var sessionMiddleware = require('./lib/session_storage/index')(config);
var mongo = require('./lib/db/connect');
var logger = require('./lib/logger');
var version = require('./lib/middleware/version');
var helmet = require('helmet');
var Router = require('express').Router();

app.use('/public', express.static(path.resolve(__dirname, './public')));


global.__base = path.join(__dirname, '/');

// mongo
mongo.setConnectionString(config.mongo.connectionString);

// healthcheck endpoints
app.use(require('./lib/middleware/ping'));
app.use(version);

app.use(helmet());
app.use(helmet.noCache());

// static pages
app.use(require('./lib/middleware/static-routes'));

app.use(function setVersion(req, res, next) {
  res.locals.versionNumber = version.versionNumber;
  next();
});

app.use(function setAssetPath(req, res, next) {
  res.locals.assetPath = '/public';
  res.locals.stylesheet = 'app.css';
  next();
});

app.use(function setBaseUrl(req, res, next) {
  res.locals.feedbackLink = config.surveyAddress;
  res.locals.baseUrl = req.baseUrl;
  next();
});

function clearCookies(req, res, next) {
  res.clearCookie('hort.sid');
  res.clearCookie('hof-wizard-sc');
  next();
}

require('hof').template.setup(app);

app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, './apps/common/views'));
app.enable('view cache');

app.use(require('express-partial-templates')(app));
app.engine('html', require('hogan-express-strict'));

app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('body-parser').json());

if (config.env !== 'development') {
  app.set('trust proxy', 1);
}
app.use(sessionMiddleware.cookieParser);
app.use(sessionMiddleware.secureCookies);
app.use(sessionMiddleware.initSession);

// use the hof middleware
app.use(require('hof').middleware.cookies());

// apps
app.use(require('./apps/inclusion-tool/'));

// 404
app.use(require('./lib/middleware/not-found'));

// errors
app.use(require('./lib/middleware/error'));

app.listen(config.port, config.listen_host);

logger.info('App listening on port', config.port);

