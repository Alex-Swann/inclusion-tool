'use strict';

const BaseController = require('hof-form-controller');

class AccessNeedsController extends BaseController {

  saveValues(req, res, callback) {
    var formData = req.body;
    delete formData['x-csrf-token'];
    for (var key in formData) {
      if (formData[key]) {
        req.sessionModel.set(key, formData[key]);
      }
    }
    return super.saveValues(req, res, callback);
  }

}

module.exports = AccessNeedsController;
