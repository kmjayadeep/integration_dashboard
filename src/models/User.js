const mongoose = require('mongoose');

var schema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  employeeId: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  integrations: {
    github: {
      active: {
        type: Boolean,
        default: true
      },
      username: String
    }
  }
});
var User = mongoose.model('User', schema);

module.exports = User;
