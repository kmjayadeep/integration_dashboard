const mongoose = require('mongoose');
const config = require('../../config/config');

module.exports = {
  initialize: async ()=>{
    console.log(`connecting to ${config.mongo.url}`);
    await mongoose.connect(config.mongo.url, {useNewUrlParser: true, useUnifiedTopology: true}).catch((err)=>{
      console.error(err);
      console.log('DB not connected');
      throw err;
    })
    console.log('db connected');
  }
}
