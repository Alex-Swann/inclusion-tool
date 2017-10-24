'use strict';

module.exports = {
  'rating': {
    validate: ['required'],
    className: ['form-control'],
    options: [{
      value: '',
      label: 'Please select an option:'
    }, {
      value: '1',
      label: '1. Never have, never will'
    }, {
      value: '2',
      label: '2. Was online, but no longer'
    }, {
      value: '3',
      label: '3. Willing but unable'
    }, {
      value: '4',
      label: '4. Reluctantly online'
    }, {
      value: '5',
      label: '5. Learning the ropes'
    }, {
      value: '6',
      label: '6. Task specific'
    }, {
      value: '7',
      label: '7. Basic skills'
    }, {
      value: '8',
      label: '8. Confident'
    }, {
      value: '9',
      label: '9. Expert'
    }]
  }
};