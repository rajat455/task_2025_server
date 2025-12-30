const bcrypt = require("bcrypt");
const userModule = require("./userModule");
const { messages, jwt_key, jwt_ExpireTime } = require("../constents");
const { AppError } = require("../custome");
const jwt = require("jsonwebtoken");

class UserContrller {
  constructor() {
    this.listUser = this.listUser.bind(this);
  }

  async verifyToken(token) {
    return jwt.verify(token, jwt_key);
  }

  async registerUser(req, res) {
    const { password } = req.body;
    const missingFields = Object.keys(req.body).filter((key) => !req.body[key]);
    if (missingFields.length > 0)
      throw new AppError(
        `Missing Values ${missingFields.join(", ")}${messages[400]}`,
        400
      );

    if (password.length < 8)
      throw new AppError("Password must be at least 8 characters long", 400);
    req.body.password = bcrypt.hashSync(password, 8);
    let result = await userModule.model.create({ ...req.body });
    if (!result) throw new AppError(statusCode[500], 500);
    result = result.toObject();
    delete result.password;
    delete result.__v;
    const token = jwt.sign(
      {
        ...result,
      },
      jwt_key,
      { expiresIn: jwt_ExpireTime }
    );
    if (!token) throw new AppError(messages[500], 500);
    return res
      .status(200)
      .send({ message: "Success", token: token, user: result });
  }

  async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password)
      throw AppError(`Missing Values Email/Password`, 400);
    let user = await userModule.model.findOne({ email }).select("+password");
    if (!user) throw new AppError(`Email not exist!${messages[404]}`, 404);
    user = user.toObject();
    if (!user.isActive)
      throw new AppError(`User Is Inactive!${messages[403]}`, 403);
    if (!bcrypt.compareSync(password, user.password))
      throw new AppError(
        `Email and Password aren't match!${messages[401]}`,
        401
      );
    delete user.password;
    delete user.__v;
    const token = jwt.sign(
      {
        ...user,
      },
      jwt_key,
      { expiresIn: jwt_ExpireTime }
    );
    if (!token) throw new AppError(messages[500], 500);
    return res
      .status(200)
      .send({ message: "Success", token: token, user: user });
  }

  async listUser(req, res) {
    const { Auth } = req.body;
    if (Auth.role !== "admin")
      throw new AppError(`Permission denied!${messages[403]}`, 403);
    let users = await userModule.model.find(
      { $or: [{ role: "user" }, { email: Auth.email }] },
      { fullName: true, email: true, role: true, isActive: true }
    );
    if (!users) throw new AppError(messages[500], 500);
    return res.status(200).send({ message: "Success", users });
  }

  async updateUser(req, res) {
    const { Auth } = req.body;
    if (Auth.role !== "admin" && req.body._id !== Auth._id)
      throw new AppError(
        `Permission denied , User only can update own profile!${messages[403]}`,
        403
      );
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 8);
    }
    delete req.body.Auth;
    const _id = req.body._id;
    delete req.body._id;
    delete req.body.email;
    const result = await userModule.model.updateOne(
      { _id: _id },
      { ...req.body }
    );
    if (!result || result.modifiedCount <= 0)
      throw new AppError(`${messages[500]}`, 500);
    return res.status(200).send({ message: "Success" });
  }

  async removeUser(req, res) {
    const { Auth } = req.body;

    if (Auth.role !== "admin" && req.params.id !== Auth._id)
      throw new AppError(
        `Permission denied , User only can Delete own profile!${messages[403]}`,
        403
      );
    const result = await userModule.model.deleteOne({ _id: req.params.id });
    if (!result || result.deletedCount <= 0)
      throw new AppError(`${messages[500]}`, 500);
    return res.status(200).send({ message: "Success" });
  }
}

const userController = new UserContrller();
module.exports = userController;
