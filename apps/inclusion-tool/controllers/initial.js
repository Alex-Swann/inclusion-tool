'use strict';

const BaseController = require('hof-form-controller');

class InitialController extends BaseController {

  getValues(req, res, callback) {
    req.sessionModel.reset();
    return super.successHandler(req, res, callback);
  }

}

module.exports = InitialController;
