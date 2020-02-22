const mongoose = require('mongoose');

var schema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  lastSync: Date,
  pullRequestsCount: Number,
  pullRequests: [{
    _id: false,
    id: String,
    createdAt: Date,
    mergedAt: Date,
    title: String,
    merged: Boolean,
    closed: Boolean,
    permalink: String
  }],
  issues: [{
    _id: false,
    id: String,
    createdAt: Date,
    closedAt: Date,
    title: String,
    closed: Boolean,
    url: String
  }]
});
var Github = mongoose.model('Github', schema);

module.exports = Github;
