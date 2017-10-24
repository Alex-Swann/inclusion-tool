'use strict';

const BaseController = require('hof-form-controller');
const productConfig = require('../../../config').products['inclusion-tool'];
const database = require('../../../lib/db/connect');
const _ = require('lodash');
const logger = require('../../../lib/logger');

class SubmitApplicationController extends BaseController {

  dataMunge(data) {
    let mungedData = data;
    const arrayKeys = ['csrf-secret', 'startChoice', 'errors',
      'dateOfSession-day', 'dateOfSession-month', 'dateOfSession-year'];
    arrayKeys.forEach(function (key) {
      delete mungedData[key];
    });
    return mungedData;
  }

  getValues(req, res, callback) {
    let dataToSubmit = this.dataMunge(req.sessionModel.attributes);
    return new Promise((resolve, reject) => {
      database.getConnection(function insertToDB(err, db) {
        if (err) reject(err);
        db.collection(`inclusion-tool`).insert(dataToSubmit, callback);
        resolve(JSON.stringify(dataToSubmit));
      });
    }).then((data) => {
      logger.info('Submitted participant details to db: ' + data);
      req.sessionModel.reset();
      req.sessionModel.set('submit', true);
      return super.successHandler(req, res, callback);
    }).catch((err) => {
      logger.error('Handle rejected promise ('+err+') here.');
    });
  }

}

module.exports = SubmitApplicationController;
