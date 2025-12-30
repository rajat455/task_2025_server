const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Required Field 'fullName' is Empty"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Required Field 'email' is Empty"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email!"],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

class UserModule {
  constructor() {
    this.model = mongoose.model("users", userSchema);
  }
}
const userModule = new UserModule();

module.exports = userModule;
