'use strict';

module.exports = {
  'startChoice': {
    validate: ['required'],
    legend: {
      className: ['visuallyhidden']
    },
    options: [{
      value: 'G',
      label: 'View guidance material to help decide the digital inclusion category of your participant'
    }, {
      value: 'S',
      label: 'Save a research participants\' digital inclusion data'
    }, {
      value: 'V',
      label: 'View a project\'s digital inclusion data'
    }]
  }
};
