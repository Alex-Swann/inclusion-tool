'use strict';

module.exports = SuperClass => class extends SuperClass {

  getSignOutLink(res) {
    if (this.options.hasOwnProperty('signOutLink')) {
      return this.options.signOutLink;
    }
    return res.locals && res.locals.signOutLink || false;
  }

  locals(req, res) {
    return Object.assign({}, super.locals(req, res), {
      signOutLink: this.getSignOutLink(res)
    });
  }

};
