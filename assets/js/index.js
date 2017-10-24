'use strict';

var toolkit = require('hof').toolkit;
var helpers = toolkit.helpers;
var progressiveReveal = toolkit.progressiveReveal;
var formFocus = toolkit.formFocus;

helpers.documentReady(progressiveReveal);
helpers.documentReady(formFocus);

require('./polyfills/details.polyfill');

var about = require('./about');
helpers.documentReady(about.setup);

var d3Graph = require('./d3-graph');
helpers.documentReady(d3Graph);
