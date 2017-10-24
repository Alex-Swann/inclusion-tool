'use strict';

const BaseController = require('hof-form-controller');
const database = require('../../../lib/db/connect');
const fs = require('fs');
const logger = require('../../../lib/logger');

class DataController extends BaseController {

  getValues(req, res, callback) {
    let dataObj = {};
    return new Promise((resolve, reject) => {
      database.getConnection((err, db) => {
        if (err) throw err;
        for (var i = 1; i < 10; i++) {
          let rating = i.toString();
          db.collection(`inclusion-tool`).find({'rating': rating})
          .toArray((err, result) => {
            if (err) throw err;
            dataObj[rating] = result.length;
          });
        }
      });
      setTimeout(() => {
        resolve(JSON.stringify(dataObj));
      }, 250);
    }).then((data) => {
      return new Promise((resolve, reject) => {
        fs.writeFile('./public/dataGraph.json', data, 'utf8', (err) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
    }).then((data) => {
      logger.info('Written ' + data + ' to dataGraph json file.');
      return super.getValues(req, res, callback);
    }).catch((err) => {
      logger.error('Handle rejected promise ('+err+') here.');
    });
  }

}

module.exports = DataController;
