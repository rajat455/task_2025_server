const express = require("express");
const userController = require("./User/userController");
const ConnectDb = require("./connection");
const cors = require("cors");
const errorHandler = require("./Handlers/errorHandler");
const asyncHandler = require("./Handlers/asyncHandler");
const AuthHandler = require("./Handlers/AuthHanderl");
const helmet =require("helmet")
const mongoSanitize  =require("express-mongo-sanitize")
const xss =require("xss-clean")

const app = express();

app.use(cors());
app.use(express.json());

ConnectDb();

app.get("/", (req, res) => {
  return res.status(200).send({ message: "Success" });
});

// app.use(helmet())
// app.use(mongoSanitize())
// app.use(xss())
app.post("/api/user/register", asyncHandler(userController.registerUser));
app.post("/api/user/login", asyncHandler(userController.login));

app.use(asyncHandler(AuthHandler));

app.get("/api/user/listUser", asyncHandler(userController.listUser));
app.put("/api/user/update", asyncHandler(userController.updateUser))
app.delete("/api/user/delete/:id", asyncHandler(userController.removeUser))

app.listen(5000, () => {
  console.log("server started");
});

app.use(errorHandler);
