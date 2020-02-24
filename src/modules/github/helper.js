
const moment = require('moment');

const convertGithubDataToDateCount = (githubData, daysCount) => {
  const { issues, pullRequests, commits } = githubData;
  const today = moment(moment().format('YYYY-MM-DD'));

  const data = {};
  const datesArray = [];
  for (let i = 0; i < daysCount; i++) {
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

  for (let commit of commits) {
    const committedDate = moment(commit.committedDate).format('YYYY-MM-DD');
    if (data[committedDate]) {
      data[committedDate].commits++;
    }
  }

  for (let issue of issues) {
    const createdAt = moment(issue.createdAt).format('YYYY-MM-DD');
    if (data[createdAt]) {
      data[createdAt].issues++;
    }
  }

  for (let pr of pullRequests) {
    const createdAt = moment(pr.createdAt).format('YYYY-MM-DD');
    if (data[createdAt]) {
      data[createdAt].pullRequests++;
    }
  }

  return data;
}

exports.convertGithubDataToDateCount = convertGithubDataToDateCount;
