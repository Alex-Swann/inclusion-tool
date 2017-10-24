'use strict';

var $ = require('jquery');

function slide(key) {
  var selectedEl = $('[data-section-name=' + key + ']');
  selectedEl.toggle('fast');
}

function emitClick(e) {

  var target = $(e.target);

  function navigateTo(where) {
    window.location.hash = where;
    return false;
  }

  if (target.closest('dl').length) {
    if (target.attr('href') && target.attr('rel') !== 'external') {
      return navigateTo(target.attr('href').substr(1));
    } else if (target.hasClass('block-label')) {
      if (target.find('a').length) {
        return navigateTo(target.find('a').attr('href').substr(1));
      }
    }
  }
}

function hideAll() {
  $('[data-section-name]').hide();
}

function setup() {
  if ($('#content #about').length) {
    registerListeners();
    navigateToSection(window.location.hash.substr(1));
  }
}
function navigateToSection(name) {
    hideAll();
    slide(name);
}

function navigateOnHashchange() {
  navigateToSection(window.location.hash.substr(1));
}

function registerListeners() {
  $(window.document).on('click', emitClick);
  $(window).on('hashchange', navigateOnHashchange);
  $(window).on('unload', function unregister() {
    $(window.document).off('click', emitClick);
    $(window.document).off('hashchange', navigateOnHashchange);
  });
}

module.exports = {
  setup: setup,
  slide: slide,
  emitClick: emitClick,
  hideAll: hideAll,
  navigateToSection: navigateToSection,
  navigateOnHashchange: navigateOnHashchange,
  registerListeners: registerListeners
};
