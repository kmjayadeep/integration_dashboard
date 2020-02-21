const User = require('../../models/User');
const fetchGithub = require('./fetchGithub');

const activate = async (req, res)=>{
 const { username }  = req.body;
 const user = await User.findById(req.user._id);
 user.integrations.github.username = username;
 await user.save();
 res.json(user)
}

const getStats = () => {

}

const refresh = (req, res) => {
  fetchGithub();
  res.json('refreshing')
}

exports.getStats = getStats;
exports.refresh = refresh;
exports.activate = activate;
