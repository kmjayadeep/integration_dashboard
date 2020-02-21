const graphql = require('graphql-request');
const Github = require('../../models/Github');
const config = require('../../../config/config');
const User = require('../../models/User');

const GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';

async function fillData(username) {
  console.log(`filling github data for ${username}`);
  const graphQLClient = new graphql.GraphQLClient(GRAPHQL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${config.github.token}`,
    },
  })

  const query = `
    query($username: String!) { 
      user(login: $username) { 
        pullRequests(first: 100) {
          totalCount
          nodes {
            title
            merged
            closed
            mergedAt
            permalink
            headRefName
            createdAt
          }
        }
      }
    }
  `;

  const variables = {
    username
  }

  const data = await graphQLClient.request(query, variables);

  const { pullRequests } = data.user;
  let githubData = await Github.findOne({
    username
  });
  if(!githubData){
    githubData = new Github({
      username
    });
  }
  githubData.lastSync = Date.now();
  githubData.pullRequestsCount = pullRequests.totalCount;
  githubData.pullRequests = pullRequests.nodes;

  const result = await githubData.save();
  console.log(result);
}

// fillData('kmjayadeep').catch(error => console.error(error))

const fetchGithub = async () => {
  const users = await User.find({
    'integrations.github.active': true
  });

  const usernames = users.map(user => user.integrations.github.username);
  usernames.forEach(fillData);
}

module.exports = fetchGithub;
