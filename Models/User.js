const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

userSchema.plugin(AutoIncrement, { inc_field: "userId" });
module.exports = mongoose.model("User", userSchema);