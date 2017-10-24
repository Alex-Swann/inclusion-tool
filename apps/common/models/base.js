'use strict';

const _ = require('lodash');
const logger = require('../../../lib/logger');
const baseConfig = require('../../../config');
const request = require('request-promise');
const db = require('../../../lib/db');
const referenceId = require('rtp-reference-id');
const put = require('./common/put');

class BaseModel {

  constructor(config) {
    this.config = config || {};
  }

  static set(req, key, data) {
    // req, value, 'property'
    if (data !== undefined && key && typeof key === 'string') {
      return req.sessionModel.set(key, data);
    } else if (typeof key === 'object') {
      // req, { property: value }
      _.each(key, (datum, k) => {
        return req.sessionModel.set(k, datum);
      });
      return req.sessionModel;
    }
    return new Error('Called set with unrecognized data');
  }

  static get(req, key) {
    return req.sessionModel.get(key);
  }

  generateOrderCode(req) {
    const orderCode = referenceId.generateOrderCode(this.config.orderCodePrefix);
    logger.info('Generated order code', orderCode);
    this.constructor.set(req, 'orderCode', orderCode);
    return Promise.resolve(orderCode);
  }

  setAsPaid(req, cost) {
    this.constructor.set(req, {
      referenceId: referenceId.generateApplicationReference(this.config.referenceIdAppType),
      feeInPence: cost,
      paid: true,
      paymentDate: new Date()
    });
    return Promise.resolve(req.sessionModel);
  }

  saveToDb(req) {
    let data = req.sessionModel.attributes;
    if (!data.objectId) {
      return db.insertApplication(data, this.config.mongoCollection)
        .then(result => {
          this.constructor.set(req, 'objectId', result);
          return Promise.resolve(result);
        });
    }
    return db.updateApplicationByObjectId(data.objectId, data, this.config.mongoCollection);
  }

  setAsImported(req, error) {
    return Promise.resolve(this.constructor.set(req, 'imported', !error));
  }

  saveToDbAndResolve(req) {
    return this.saveToDb(req).then(result => {
      return Promise.resolve(result);
    }).catch(saveError => {
      logger.error('Failed to save to database', saveError, req.sessionModel.get('objectId'));
      return Promise.resolve();
    });
  }

  setAsSmokeTestApplication(req) {
    this.constructor.set(req, {
      applicationReference: referenceId.generateApplicationReference(this.config.referenceIdAppType),
      orderCode: referenceId.generateOrderCode(this.config.orderCodePrefix),
      card: 'VISA-SSL'
    });
    return Promise.resolve(req.sessionModel);
  }

  postToIntegrationService(data, req) {
    return put.call(this, data, req);
  }

  transform(req) {
    return Promise.resolve(req.sessionModel.attributes);
  }

  send(data, fromEmail) {
    const service = baseConfig.integrationService;
    const protocol = service.protocol;
    const uri = service.url;

    const requestConfig = fromEmail ? service[this.config.options.product].emailRequest :
      service[this.config.options.product].request;

    logger
      .info(`Posting ${JSON.stringify(data)} to: ${uri} with protocol ${protocol} and path ${requestConfig.endpoint}`);
    return request({
      uri: `${protocol}://${uri}${requestConfig.endpoint}`,
      json: data,
      method: requestConfig.method,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 20000
    });
  }

  getApplicationStatus(req, fromEmail) {
    const requestProps = _.pick(req.sessionModel.attributes, this.checkProps);
    const schema = fromEmail ? this.requestEmailTokenSchema : this.requestSchema;

    return this.validate(schema, requestProps)
      .then(() => this.send(requestProps, fromEmail))
      .then(response => {
        if (!response) {
          return Promise.reject('The server returned no response');
        }

        return this.validate(this.responseSchema, response)
          .then(result => {

            return result.application ? result.application : result;
          })
          .catch(err => {
            logger.error('Request to getApplicationStatus returned invalid response', err);
          return Promise.reject(err);
        });
      });
  }

}

module.exports = BaseModel;
