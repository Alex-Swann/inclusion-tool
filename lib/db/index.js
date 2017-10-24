'use strict';

const connection = require('./connect');
const ObjectID = require('mongodb').ObjectID;

const pluralise = (name) => {
  if (name.endsWith('y')) {
    return name.slice(0, -1) + 'ies';
  }
  if (name.endsWith('s')) {
    return name;
  }
  return name + 's';
};

function insertApplication(data, collectionName) {
  return new Promise((resolve, reject) => {
    connection.getConnection((connectionError, db) => {
      if (connectionError) {
        return reject(connectionError);
      }
      const collection = db.collection(pluralise(collectionName));
      collection.insert(data, (insertError, result) => {
        if (insertError) {
          return reject(insertError);
        }
        resolve(result.insertedIds.shift().toString());
      });
    });
  });
}

function upsertApplicationByQuery(query, update, applicationType) {
  return new Promise((resolve, reject) => {
    connection.getConnection((connectionError, db) => {
      if (connectionError) {
        return reject(connectionError);
      }
      const collection = db.collection(pluralise(applicationType));
      const options = {
        upsert: true,
        new: true
      };
      collection.findAndModify(query, {}, update, options, (err, result) => {
        if (err) {
          return reject(err);
        }
        const response = (result && result.value) ? result.value : null;
        return resolve(response);
      });
    });
  });
}

function updateApplicationByObjectId(_id, data, applicationType) {
  const id = typeof _id === 'string' ? new ObjectID(_id) : _id;
  return new Promise((resolve, reject) => {
    connection.getConnection((connectionError, db) => {
      if (connectionError) {
        return reject(connectionError);
      }
      let collection = db.collection(pluralise(applicationType));
      collection.updateOne({_id: id}, {$set: data}, {upsert: false}, updateError => {
        if (!updateError) {
          return resolve(id);
        }
        return reject(updateError);
      });
    });
  });
}

function findApplicationsByQuery(query, sort, applicationType) {
  return new Promise((resolve, reject) => {
    connection.getConnection((connectionError, db) => {
      if (connectionError) {
        return reject(connectionError);
      }
      let collection = db.collection(pluralise(applicationType));
      collection.find(query).sort(sort).toArray((err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  });
}

function dropApplications(applicationType) {
  return new Promise((resolve, reject) => {
    return connection.getConnection((connectionError, db) => {
      if (connectionError) {
        return reject(connectionError);
      }
      let collection = db.collection(pluralise(applicationType));
      collection.drop(err => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  });
}

module.exports = {
  pluralise: pluralise,
  insertApplication: insertApplication,
  upsertApplicationByQuery: upsertApplicationByQuery,
  updateApplicationByObjectId: updateApplicationByObjectId,
  findApplicationsByQuery: findApplicationsByQuery,
  dropApplications: dropApplications,
  connection: connection
};
