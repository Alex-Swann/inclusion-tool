'use strict';

const _ = require('lodash');

function findAllEnabledForDisplayToCustomers(db) {
  let portsToExcludeToCustomers = ['TN1', 'TN2', 'TN3', 'TN4', 'TN5', 'TW5', 'GAN', 'GAT', 'EDX', 'IND', 'JLE', 'JPE',
    'JBE', 'MN1', 'MN2', 'MBA', 'BEU', 'BHM'];
  let portsCollectionName = 'ports';
  let sortBy = {name: 1};
  let query = {enabled: true, _id: {$nin: portsToExcludeToCustomers}};
  let shortner = (airports) => _.map(airports, (element) => {
    return element.name.replace(' Airport', '');
  });

  return db.findApplicationsByQuery(query, sortBy, portsCollectionName)
  .then((ports) => shortner(ports));
}

module.exports = {
  findAllEnabledForDisplayToCustomers: findAllEnabledForDisplayToCustomers
};
