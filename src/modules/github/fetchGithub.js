const graphql = require('graphql-request');
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
        name
      }
    }
  `;

  const variables = {
    username
  }

  const data = await graphQLClient.request(query, variables);
  console.log(JSON.stringify(data, undefined, 2))
}

fillData('kmjayadeep').catch(error => console.error(error))

const fetchGithub = async () => {
  const users = await User.find({
    'integrations.github.active': true
  });

  const usernames = users.map(user => user.integrations.github.username);
  usernames.forEach(fillData);
}

module.exports = fetchGithub;
