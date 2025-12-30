const mongoose = require("mongoose");
const { dbUrl } = require("./constents");
const userModule = require("./User/userModule");

async function ConnectDb() {
  try {
    await mongoose.connect(dbUrl);
    await userModule.model.syncIndexes("email");
    console.log("Db Connected");
  } catch (error) {
    console.log("Db isn't Connected");
  }
}

module.exports = ConnectDb;
