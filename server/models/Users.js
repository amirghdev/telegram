const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone: Number,
  email: String,
  code: {
    code: Number,
    expire: Number,
  },
  twostep: {
    code: Number,
    active: {
      type: Boolean,
      default: false,
    },
  },
  first_name: String,
  last_name: String,
  user_id: Number,
  username: String,
  avatar: String,
  is_active: {
    type: Boolean,
    default: false,
  },
});

const Users = mongoose.model("users", userSchema);

module.exports = Users;
