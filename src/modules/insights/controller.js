const moment = require('moment');
const User = require('../../models/User');
const Github = require('../../models/Github');
const gitHelper = require('../github/helper');

const getInsights = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  const username = user.integrations.github.username;
  const githubData = await Github.findOne({
    username
  });

  const data = gitHelper.convertGithubDataToDateCount(githubData, 7);


  const mostProductiveDay = Object.keys(data).reduce((maxDate, cur)=>{
    const prevObj = data[maxDate];
    const curObj = data[cur];
    const maxContributions = prevObj.commits + prevObj.pullRequests + prevObj.issues; 
    const curContributions = curObj.commits + curObj.pullRequests + curObj.issues; 
    return maxContributions > curContributions ? maxDate : cur;
  }, Object.keys(data)[0]);

  const dateObj = moment(mostProductiveDay);
  const formatted = dateObj.format('MMM DD, dddd');
  const values = data[mostProductiveDay];
  const productivity = values.commits + values.issues + values.pullRequests;
  const gitValueFormatted = `${formatted} (${productivity} Contributions)`


  const result = [{
    description: 'Most productive day in the last week',
    value: gitValueFormatted
  },{
    description: 'Completed 10000 steps in a day',
    value: 	'Feb 15, Saturday (12322 Steps)'
  }];

  res.json(result);
}

exports.getInsights = getInsights;
