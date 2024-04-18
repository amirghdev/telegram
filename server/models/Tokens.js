const mongoose = require("mongoose");

const tokensSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
});

const Tokens = mongoose.model("tokens", tokensSchema);

module.exports = Tokens;
