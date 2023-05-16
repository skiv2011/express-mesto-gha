const OK = 200;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const METHOD_NOT_ALLOWED = 405;
const CONFLICT = 409;
const INTERNAL_SERVER = 500;

module.exports.statusCode = {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  METHOD_NOT_ALLOWED,
  INTERNAL_SERVER,
  FORBIDDEN,
  CONFLICT,
  UNAUTHORIZED,
};