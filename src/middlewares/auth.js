const User = require('../models/User');
const authMiddleware = async(req, res, next) =>{
  const user = await User.findOne({
    employeeId: "I341935"
  })
  req.user = user;
  next();
}

module.exports = authMiddleware;
