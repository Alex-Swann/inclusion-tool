'use strict';

module.exports = {
  'dateOfSession': {
    validate: ['date', {
        type: 'before',
        arguments: [0, 'days']
      }
    ],
    legend: 'fields.dateOfSession.legend',
    hint: 'fields.dateOfSession.hint'
  },
  'dateOfSession-day': {
    validate: ['numeric'],
    label: 'fields.dateOfSession-day.label'
  },
  'dateOfSession-month': {
    validate: ['numeric'],
    label: 'fields.dateOfSession-month.label'
  },
  'dateOfSession-year': {
    validate: ['numeric'],
    label: 'fields.dateOfSession-year.label'
  }
};
