const moment = require('moment');
const User = require('../../models/User');
const Github = require('../../models/Github');
const fetchGithub = require('./fetchGithub');

const activate = async (req, res) => {
  const { username } = req.body;
  const user = await User.findById(req.user._id);
  user.integrations.github.username = username;
  await user.save();
  res.json(user);
}

const getStats = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  const username = user.integrations.github.username;
  const githubData = await Github.findOne({
    username
  });
  const day = moment();
  const yesterday = moment().subtract(1, 'days');
  const lastWeek = moment().subtract(7, 'days');
  const lastMonth = moment().subtract(60, 'days');

  let dailyPrCount = 0, weeklyPrCount = 0, monthlyPrCount = 0;
  let dailyIssueCount = 0, weeklyIssueCount = 0, monthlyIssueCount = 0;

  if (githubData && githubData.pullRequests) {
    for (pr of githubData.pullRequests) {
      const createdAt = moment(pr.createdAt);
      if (createdAt.isAfter(yesterday)) {
        dailyPrCount++;
      }
      if (createdAt.isAfter(lastWeek)) {
        weeklyPrCount++;
      }
      if (createdAt.isAfter(lastMonth)) {
        monthlyPrCount++;
      }
    }
  }

  if (githubData && githubData.issues) {
    for (issue of githubData.issues) {

      console.log(issue)
      const createdAt = moment(issue.createdAt);
      if (createdAt.isAfter(yesterday)) {
        dailyIssueCount++;
      }
      if (createdAt.isAfter(lastWeek)) {
        weeklyIssueCount++;
      }
      if (createdAt.isAfter(lastMonth)) {
        monthlyIssueCount++;
      }
    }
  }

  const stats = {
    daily: {
      pullRequests: dailyPrCount,
      issues: dailyIssueCount
    },
    weekly: {
      pullRequests: weeklyPrCount,
      issues: weeklyIssueCount
    },
    monthly: {
      pullRequests: monthlyPrCount,
      issues: monthlyIssueCount
    }
  };
  res.json(stats);
}

const refresh = (_req, res) => {
  fetchGithub();
  res.json('refreshing')
}

exports.getStats = getStats;
exports.refresh = refresh;
exports.activate = activate;
