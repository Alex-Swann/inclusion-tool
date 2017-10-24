'use strict';

const BaseController = require('hof-form-controller');

class StartController extends BaseController {

  locals(req, res, callback) {
    const returnLocals = Object.assign({}, super.locals(req, res, callback), {
      SUCCESS: req.sessionModel.get('submit')
    });
    req.sessionModel.unset('submit');
    return returnLocals;
  }

}

module.exports = StartController;
