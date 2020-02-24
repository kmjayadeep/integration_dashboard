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

  // today 00:00 (yesterday midnight)
  const yesterday = moment(moment().format('YYYY-MM-DD'));
  const lastWeek = yesterday.clone().subtract(7, 'days');
  const lastMonth = yesterday.clone().subtract(60, 'days');

  let dailyPrCount = 0, weeklyPrCount = 0, monthlyPrCount = 0;
  let dailyIssueCount = 0, weeklyIssueCount = 0, monthlyIssueCount = 0;
  let dailyCommitCount = 0, weeklyCommitCount = 0, monthlyCommitCount = 0;

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

  if (githubData && githubData.commits) {
    for (commit of githubData.commits) {
      const createdAt = moment(commit.committedDate);
      if (createdAt.isAfter(yesterday)) {
        dailyCommitCount++;
      }
      if (createdAt.isAfter(lastWeek)) {
        weeklyCommitCount++;
      }
      if (createdAt.isAfter(lastMonth)) {
        monthlyCommitCount++;
      }
    }
  }

  const stats = {
    daily: {
      pullRequests: dailyPrCount,
      issues: dailyIssueCount,
      commits: dailyCommitCount
    },
    weekly: {
      pullRequests: weeklyPrCount,
      issues: weeklyIssueCount,
      commits: weeklyCommitCount
    },
    monthly: {
      pullRequests: monthlyPrCount,
      issues: monthlyIssueCount,
      commits: monthlyCommitCount
    }
  };
  res.json(stats);
}

const refresh = (_req, res) => {
  fetchGithub();
  res.json('refreshing')
}

const getGraphData = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  const username = user.integrations.github.username;
  const githubData = await Github.findOne({
    username
  });

  const { issues, pullRequests, commits } = githubData;
  const today = moment(moment().format('YYYY-MM-DD'));

  const data = {};
  const datesArray = [];
  for(let i=0;i<30;i++){
    const date = today.clone().subtract(i, 'days');
    const formatted = date.format('YYYY-MM-DD');
    data[formatted] = {
      date: formatted,
      commits: 0,
      pullRequests: 0,
      issues: 0
    };
    datesArray.push(formatted);
  }

  for(let commit of commits) {
    const committedDate = moment(commit.committedDate).format('YYYY-MM-DD');
    if(data[committedDate]) {
      data[committedDate].commits++;
    }
  }

  for(let issue of issues) {
    const createdAt = moment(issue.createdAt).format('YYYY-MM-DD');
    if(data[createdAt]) {
      data[createdAt].issues++;
    }
  }

  for(let pr of pullRequests) {
    const createdAt = moment(pr.createdAt).format('YYYY-MM-DD');
    if(data[createdAt]) {
      data[createdAt].pullRequests++;
    }
  }

  const graphData = datesArray.map(date=>(data[date]));
  const result = {
    data: graphData
  };

  res.json(result);
}

exports.getStats = getStats;
exports.refresh = refresh;
exports.activate = activate;
exports.getGraphData = getGraphData
