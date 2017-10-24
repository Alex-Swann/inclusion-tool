'use strict';

const logger = require('../../../../lib/logger');
const request = require('request-promise');
const _ = require('lodash');

module.exports = function put(data, req) {

  if (!data || !req || !req.sessionModel) {
    throw new Error('Please pass to #put both the transformed data and the req object');
  }

  return new Promise((resolve) => {

    const conf = this.config.integrationService;
    const protocol = conf.protocol;
    const uri = conf.url;
    const endpoint = conf[this.config.options.product].application.endpoint;
    const method = conf[this.config.options.product].application.method;

    function endIt(err) {
      return this.setAsImported(req, err)
        .then(resolve);
    }

    logger.info(`Posting to: ${uri} with protocol ${protocol} and path ${endpoint}`);
    return request({
      uri: `${protocol}://${uri}${endpoint}`,
      json: data,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 20000
    })
      .then(endIt.bind(this, null))
      .catch((err) => {
        let errorMessage = err.message ? err.message : err;
        if (_.get(err, 'error.errors[0]')) {
          errorMessage += ` -  ${_.get(err, 'error.errors[0]')}`;
        }
        logger.error('Something went very wrong', errorMessage);
        // resolve anyway, no matter the outcome
        return endIt.call(this, err);
      });
  });
};
