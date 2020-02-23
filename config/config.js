require('dotenv').config();

module.exports = {
    database: {
        name: process.env.DATABASE_NAME || 'gamification',
        username: process.env.DATABASE_USERNAME || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        host: process.env.DATABASE_HOST || 'localhost'
    },
    mongo:{
        url: process.env.MONGODB_URL || 'mongodb://localhost/dashboard'
    },
    user: {
        tokenSecret: process.env.TOKEN_SECRET || 'thisisahugesecretdonttellanyone',
        tokenExpires: 86400 //24hrs
    },
    github: {
      token: process.env.GITHUB_TOKEN,
      refreshInterval: process.env.GITHUB_REFRESH_INTERVAL || 60 * 60 * 1000
    }
}
