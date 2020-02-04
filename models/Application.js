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
  },
  position: {
    type: String,
    required: true
  },
  // sent: "yellow" , reject: "red", phone-screen: "purple" , onsite: "blue" , offer: "green"
  stage: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: false
  },
  contact: {
    type: String,
    required: false
  },
  notes: {
    type: String
  }
});

module.exports = Application = mongoose.model('Application', ApplicationSchema);
