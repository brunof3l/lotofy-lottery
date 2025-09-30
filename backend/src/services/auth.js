const jwt = require('jsonwebtoken');

function authenticateJWT(req, res, next) {
  // ...verificar JWT e autorização...
  next();
}

module.exports = { authenticateJWT };
