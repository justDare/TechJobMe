const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

// Create Schema
const ApplicationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  user_id: {
    type: ObjectId,
    required: true
  }
});

module.exports = Application = mongoose.model('Application', ApplicationSchema);
