'use strict';

const Validator = require('jsonschema').Validator;
const validator = new Validator();

module.exports = (schema, data) => {
  let validityStatus = validator.validate(data, schema);
  return (validityStatus.errors && validityStatus.errors.length) ?
    Promise.reject(validityStatus.errors) :
    Promise.resolve(data);
};
