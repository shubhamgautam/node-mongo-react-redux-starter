const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define  model
const commentSchema = new Schema({
  content: String,
  authorId: String,
  authorName: String,
  postId: String,
  time: Date
});

// Create the model class
const ModelClass = mongoose.model('comment', commentSchema);

// Export the model
module.exports = ModelClass;
