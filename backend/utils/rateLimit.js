const rateLimit = (req, res, next) => {
  // ...implementar rate limiting simples por IP...
  next();
};
module.exports = rateLimit;
