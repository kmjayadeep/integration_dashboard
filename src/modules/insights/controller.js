const moment = require('moment');
const User = require('../../models/User');
const Github = require('../../models/Github');


const getInsights = (req, res) => {
  res.json('ok')
}

exports.getInsights = getInsights;
