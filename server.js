
//Technical Assessment - Task 01
//Muhammad Talal Majeed
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Adding DotEnv to hide the database URL (For GitHub)
require('dotenv').config();

app.use(bodyParser.json());

//Connecting to the Database (Provided)
//{useNewUrlParser: true, useUnifiedTopology: true} are removed to avoid deprecation warnings
//Not Required in the latest version of Node & Mongoose
mongoose.connect(process.env.DATABASE);

mongoose.connection.on('error', (err) => {
    console.error('Error connecting to the database', err);
});

mongoose.connection.once('open', () => {
    console.log('Connected to the database');
});

//Strictly Requiring the title, content and author fields
const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true }
});

const Post = mongoose.model('Post', postSchema);

//Added the Async keyword to the function to make the API Asynchronous
//This is necessary for traffic handling
app.post('/posts', async (req, res) => {
    //Wrapping the API in a try-catch block to handle errors

    try {
        const newPost = new Post({
            title: req.body.title,
            content: req.body.content,
            author: req.body.author,
        });
    
        //Mongoose Save Function does not return a promise, we can use await instead
        const post = await newPost.save();

        //If the post is created successfully, we can send the post back to the client
        res.status(200).send(post);
    }
    catch (err) {
        //If there is an error, we can use the catch block to handle it
        console.error(err);
        res.status(500).send('Error creating the post');
    }
});

//Similarly we can make the GET API Asynchronous by adding the async keyword
app.get('/posts', async (req, res) => {

    try {
        //We can use the find function to get all the posts
        const posts = await Post.find();
        res.status(200).send(posts);
    }
    catch (err) {
        //If there is an error, we can use the catch block to handle it
        console.error(err);
        res.status(500).send('Error creating the post');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
