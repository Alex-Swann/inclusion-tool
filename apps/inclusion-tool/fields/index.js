'use strict';

const _ = require('lodash');

module.exports = _.extend(
  require('./start-choice'),
  require('./date-of-session'),
  require('./participantID'),
  require('./rating'),
  require('./access-needs')
);

