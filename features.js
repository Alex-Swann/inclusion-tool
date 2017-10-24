/* eslint-disable no-console*/
'use strict';

var proc = process || {
  env: 'lies'
};
var console = console || {
  warn: function writeValue(value) {
    return value;
  }
};

function get(val) {
  if (!proc.env[val]) {
    console.warn('Feature flag ' + val + ' not found, default setting will be used.');
  }
  return proc.env[val] === undefined ? true : (proc.env[val] === 'true');
}

module.exports = {
};
