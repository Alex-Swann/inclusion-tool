'use strict';

var logger = require('../logger');
var MongoClient = require('mongodb').MongoClient;
var dbSingleton = null;
var config = require('../../config');

var connectionString = config.mongo.connectionString;

/* for replica sets use:
 'mongodb://username:password@host1:27017,host2:27017,host3:27017/dbname?w=1';
 */

function setConnectionString(connString) {
  var at = connString.lastIndexOf('@');
  if (at > 0) {
    var auth = connString.substr(0, at);
    var nodes = connString.substr(at);
    var parts = /([^:]+:[^:]+:)(.+)/.exec(auth);
    connString = parts[1] + encodeURIComponent(parts[2]) + nodes;
  }
  connectionString = connString;
}

function isDatabaseAlive(callback) {
  if (dbSingleton) {
    dbSingleton.listCollections().toArray((err, collections) => {
      callback(err === null && collections !== null);
    });
  } else {
    callback(false);
  }
}

function connect(options, callback) {
  /* eslint-disable camelcase, no-unused-expressions */
  (options.uri_decode_auth === undefined) && (options.uri_decode_auth = true);
  /* eslint-enable camelcase, no-unused-expressions */

  MongoClient.connect(connectionString, options, (err, db) => {
    if (err) {
      logger.error('Error creating new connection: ' + err.message);
    } else {
      dbSingleton = db;
      logger.info('Created new connection for database');
    }
    callback(err, dbSingleton);
  });

}

function getConnection(options, callback) {
  // options is optional
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  isDatabaseAlive(isAlive => {
    if (isAlive) {
      callback(null, dbSingleton);
    } else {
      dbSingleton = null;
      connect(options, callback);
    }
  });

}

function disconnect(callback) {
  isDatabaseAlive(isAlive => {
    if (isAlive) {
      dbSingleton.close((err, res) => {
        dbSingleton = null;
        callback(err, res);
      });
    } else {
      dbSingleton = null;
      callback(null, true);
    }
  });
}

module.exports = {
  getConnection: getConnection,
  setConnectionString: setConnectionString,
  disconnect: disconnect
};
