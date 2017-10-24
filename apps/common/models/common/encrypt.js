'use strict';

const crypto = require('crypto');
const config = require('../../../../config');
const logger = require('../../../../lib/logger');

function sign(datum) {
  if (!config.encryptApplications.signed || !config.encryptApplications.passwordForSigning) {
    return datum;
  }
  let signer = crypto.createHmac('sha256', config.encryptApplications.passwordForSigning);
  signer.update(datum);
  let signatureBuffer = new Buffer(signer.digest('base64'), 'base64');
  return `${datum}----${signatureBuffer.toString('base64')}`;
}

module.exports = function encrypt(data) {
  if (typeof data !== 'string' && typeof data !== 'object') {
    let errorString = 'Wrong type of data passed to encrypt';
    logger.warn(errorString);
    return Promise.reject(errorString);
  }
  let encodedData;
  // if data is an object but not a buffer, stringify it. If it's a buffer, it can be used as it is.
  let dataToEncode = typeof data === 'object' && !(data instanceof Buffer) ? JSON.stringify(data) : data;

  // create a random buffer to use as initialisation vector
  let iv = new Buffer(crypto.randomBytes(16));

  // create a Cipheriv instance
  let cipher = crypto.createCipheriv(config.encryptApplications.algorithm, config.encryptApplications.secret, iv);

  // update the cipheriv with the data (here data being either a buffer or a string). No need to specify
  // the encoding of the input as it's utf-8 by default. But we do need to specify the encoding of the output.
  encodedData = cipher.update(dataToEncode, null, config.encryptApplications.encoding);

  // finalise the cipheriv -- we need to pass the encoding again
  encodedData += cipher.final(config.encryptApplications.encoding);

  // convert the iv to base64 string before resolving
  return Promise.resolve({
    data: sign(encodedData),
    iv: sign(iv.toString('base64'))
  });
};
