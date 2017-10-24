'use strict';

module.exports = {
  'participantID': {
    label: 'fields.participantID.label',
    hint: 'fields.participantID.hint',
    validate: ['required', {
      type: 'regex',
      arguments: /^[a-zA-Z0-9]+$/
    }]
  }
};
