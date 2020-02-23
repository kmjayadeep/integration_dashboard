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

        issues(first: 100) {
          totalCount
          nodes {
            title
            createdAt
            closed
            closedAt
            url
          }
        }

        repositories(first: 20, orderBy: {field: CREATED_AT, direction: DESC}) {
          totalCount
          nodes{
            name
            refs(refPrefix: "refs/heads/", first: 10) {
              nodes{
                name
                target {
                  ... on Commit {
                    history(first: 100, author: {id: "MDQ6VXNlcjY3OTMyNjA="}) {
                      totalCount
                      nodes {
                        id
                        messageHeadline
                        committedDate
                      }
                    }
                  }
                }
              }
            }
          } 
        }

      }
    }
  `;

  const variables = {
    username
  }

  const data = await graphQLClient.request(query, variables);

  const { pullRequests, issues, repositories} = data.user;
  const repoData = repositories.nodes.map(repo=>{
    const { name, refs } = repo;
    const branches = refs.nodes.map(branch=>{
      return branch.target.history.nodes.map(commit=>({
          ...commit,
          branch: branch.name,
          repository: name
        }));
    });
    const commits = [].concat(...branches);
    return commits;
  });
  const commits = [].concat(...repoData);
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
  githubData.issues = issues.nodes;
  githubData.issuesCount = issues.totalCount;
  githubData.repositoriesCount = repositories.totalCount;
  githubData.commits = commits;

  const result = await githubData.save();
  console.log(result.pullRequests.length);
  console.log(result.issues.length);
  console.log(result.commits.length);
}


const fetchGithub = async () => {
  const users = await User.find({
    'integrations.github.active': true
  });

  const usernames = users.map(user => user.integrations.github.username);
  return Promise.all(usernames.map(fillData));
}

module.exports = fetchGithub;
