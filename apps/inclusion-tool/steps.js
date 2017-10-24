'use strict';

const options = {
  product: 'inclusion-tool'
};

module.exports = {
  '/': {
    controller: require('./controllers/initial'),
    next: '/start'
  },
  '/start': {
    template: 'startChoice.html',
    backLink: false,
    controller: require('./controllers/start'),
    fields: [
      'startChoice'
    ],
    forks: [{
      target: '/guidance',
      condition: {
        field: 'startChoice',
        value: 'G'
      }
    }, {
      target: '/participant',
      condition: {
        field: 'startChoice',
        value: 'S'
      }
    }, {
      target: '/data',
      condition: {
        field: 'startChoice',
        value: 'V'
      }
    }]
  },
  '/guidance': {
    template: 'guidance.html'
  },
  '/participant': {
    template: 'participant.html',
    controller: require('./controllers/date-of-session'),
    dateFormat: 'YYYY-MM-DD',
    fields: [
      'dateOfSession',
      'dateOfSession-day',
      'dateOfSession-month',
      'dateOfSession-year',
      'participantID',
      'rating',
      'accessNeeds'
    ],
    forks: [{
      target: '/access-needs',
      condition: {
        field: 'accessNeeds',
        value: 'Yes'
      }
    }, {
      target: '/submit',
      condition: {
        field: 'accessNeeds',
        value: 'No'
      }
    }]
  },
  '/access-needs': {
    template: 'access-needs.html',
    controller: require('./controllers/access-needs'),
    next: '/submit'
  },
  '/submit': {
    template: 'access-needs.html',
    controller: require('./controllers/submit'),
    next: '/start'
  },
  '/data': {
    template: 'data-graph.html',
    controller: require('./controllers/data')
  }
};
