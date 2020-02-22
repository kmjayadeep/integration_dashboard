const express = require('express');
const logger = require('morgan');
const cors = require('cors')
const bodyParser = require('body-parser');
const db = require('./src/models/index');
const authMiddleware = require('./src/middlewares/auth');
const githubController = require('./src/modules/github/controller')
const userController = require('./src/modules/user/controller')


const configureRoutes = (router) => {

  // General APIs
  router.get('/', (_, res) => res.send('Api v1.0'));
  router.get('/user/profile', userController.profile);
  router.post('/user/signup', userController.signup);
  router.post('/user/login');


  // Github apis
  router.post('/github/activate', githubController.activate);
  router.get('/github/refresh', githubController.refresh);
  router.get('/github/stats', githubController.getStats);
}

exports.initialize = async () => {
  await db.initialize();
  const app = express();
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(cors())
  const router = express.Router();
  configureRoutes(router);
  app.use(authMiddleware);
  app.use('/api/v1/', router);
  return app;
}
