'use strict';

module.exports = {
    "urls": {
        "help": "/help",
        "feedback": "/help/feedback",
        "cookies": "/help/cookies",
        "privacy": "/help/privacy",
        "terms": "/help/terms-and-conditions",
        "assets": "/public",
        "inclusion": "/inclusion-tool"
    },
    session: {
      secret: process.env.SESSION_SECRET || 'itdoesnotlooksecurebutitis',
      ttl: process.env.SESSION_TTL || 1200, /* 20 mins in seconds */
      cookieKey: 'hort.sid',
      connector: process.env.CONNECTOR || 'mongo'
    },
    mongo: {
      connectionString: process.env.MONGODB_URI || 'mongodb://localhost:27017/applicationdb',
      secret: process.env.SESSION_SECRET || 'thisisnotasecurepassword'
    },
    "logs": {
        "app": false,
        "error": false,
        "meta": {
            "errorCode": "err.code",
            "errorTemplate": "err.template",
            "gaErrorCode": "err.gaCode"
        },
        "headers": {
            "session": "X-REQ-ID"
        }
    },
    "shutdown": {
        "timeout": 120,
        "prefix": "shutdown-state"
    },
    "port": process.env.PORT || 3008,
    'products': {
      'inclusion-tool': {
        'startPage': '/inclusion-tool',
        'mongoCollection': 'inclusion-tool',
        'productDescription': 'Inclusion tool to graph scores based on inclusion',
        'narrative': 'Inclusion tool'
      }
  }
};
