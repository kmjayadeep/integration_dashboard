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

  console.log(req.body)

}



exports.signup = signup;
exports.login = login;
