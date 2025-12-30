const userController = require("../User/userController");
const { jwt_key } = require("../constents");
async function AuthHandler(req, res, next) {
  const { token } = req.headers;
  const Auth = await userController.verifyToken(token, jwt_key);
  if (!req.body && Auth) {
    req.body = { Auth: Auth };
  }
  req.body.Auth = Auth;
  next();
}

module.exports = AuthHandler;
