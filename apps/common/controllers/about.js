'use strict';

const BaseController = require('hof-form-controller');
const mongo = require('../../../lib/db');
const getPorts = require('../models/get-ports');

class AboutController extends BaseController {
  constructor(config) {
    super(config);
    getPorts.findAllEnabledForDisplayToCustomers(mongo)
    .then((ports) => {
      this.ports = ports;
    });
  }

  locals(req, res) {
    return Object.assign(
      super.locals(req, res),
      {
        portsForList: this.ports
      }
    );
  }
}

module.exports = AboutController;
