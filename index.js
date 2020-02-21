const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const db = require('./src/models/index');


exports.initialize = async () => {
  await db.initialize();
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  return app;
}
