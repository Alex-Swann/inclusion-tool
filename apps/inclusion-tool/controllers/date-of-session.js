'use strict';

const path = require('path');
const hof = require('hof');
const BaseController = require('hof-form-controller');
const ErrorClass = hof.wizard.Error;
const moment = require('moment');
const prettyDate = 'D MMMM YYYY';

class DateOfSessionController extends BaseController {

  constructor(config) {
    super(config);
    this.dateKey = 'dateOfSession';
  }

  pureProcessDate(k, v) {
    var pad = function pad(n) {
      return (n.length < 2) ? '0' + n : n;
    };
    var year = v[k + '-year'];
    var month = v[k + '-month'];
    var day = v[k + '-day'];

    return (year && month && day) ? year + '-' + pad(month) + '-' + pad(day) : '';
  }

  static isValidDate(date) {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return isFinite(date);
  }

  processDate(key, values) {
    var date = this.pureProcessDate(key, values);
    if (date) {
      if (DateOfSessionController.isValidDate(date)) {
        values[key] = date;
        values[key + '-formatted'] = values[key] === '' ? '' : moment(values[key]).format(prettyDate);
      } else {
        values[key] = 'invalid date';
        values[key + '-formatted'] = 'invalid date';
      }
    } else {
      values[key] = '';
      values[key + '-formatted'] = '';
    }

    return values[key + '-formatted'];
  }

  process(req) {
    this.processDate(this.dateKey, req.form.values);
    super.process.apply(this, arguments);
  }
}

module.exports = DateOfSessionController;
