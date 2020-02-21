const User = require('../../models/User');

const activate = async (req, res)=>{
 const { username }  = req.body;
 const user = await User.findById(req.user._id);
 user.integrations.github.username = username;
 await user.save();
 res.json(user)
}

const getStats = () => {

}

exports.getStats = getStats;
exports.activate = activate;
