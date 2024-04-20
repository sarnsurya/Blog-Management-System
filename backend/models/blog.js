const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
