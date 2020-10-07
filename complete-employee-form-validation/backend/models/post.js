const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  name: { type: String},
  email: { type: String},
  birthdate: { type: String },
  imagePath: { type: String, required: true },
  phoneNumber: { type: String },
  address: { type: String },
});

module.exports = mongoose.model("Post", postSchema);
