'use strict';

const path = require('path');
const config = require(path.join(__base, 'config'));
const router = require('express').Router();
const features = require(path.join(__base, 'features'));

var addStaticRoute = function addStaticRoute(route) {
  router.get((`/${route}`), function renderRoute(req, res) {
    res.render(path.join(__base, '/apps/common/views/info-pages/', route), {
      startLink: config.appPath,
      features: features
    });
  });
};

['about', 'cookies', 'terms-and-conditions', 'privacy-policy', 'under18s-error']
  .forEach(function addingStaticRoute(route) {
  addStaticRoute(route);
});

router.get(`/backToGovUk`, function govUK(req, res) {
  res.redirect(config.externalSites.govUKHomepage);
});

module.exports = router;
