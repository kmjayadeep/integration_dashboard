const crypto = require('crypto');
const User = require('../../models/User');

const hashPassword = (password) => crypto.createHash('sha256').update(password).digest('base64');

const signup = async (req, res) => {

  const { name, employeeId, password, email } = req.body;
  const passwordHash = hashPassword(password);

  const user = new User({
    name,
    employeeId,
    password: passwordHash,
    email,
  });

  const saved = await user.save();
  res.json(saved);
}

const login = async (req, res) => {
  res.json(req.boby);
}

const profile = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  const { _id, name, employeeId, email, integrations } = user;
  res.json({
    _id,
    name,
    email,
    employeeId,
    integrations
  });
}




exports.signup = signup;
exports.login = login;
exports.profile = profile;
