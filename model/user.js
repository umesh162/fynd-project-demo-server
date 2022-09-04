// firstname
// lastname
// email
// password
// phone
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  profile: {
    type: String,
    default:
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = User = mongoose.model("User", UserSchema);
