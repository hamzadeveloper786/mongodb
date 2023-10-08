import express from 'express';
import { nanoid } from 'nanoid';
import {client} from './../mongodb.mjs';

const db = client.db("crudop");
const col = db.collection("posts");
let router = express.Router()

let posts = [
    {
        id: nanoid(),
        title: "Hello",
        text: "Write some text...",
    }
];

router.post('/post', async (req, res, next) => {
    console.log('Create a Post!', new Date());

    if (!req.body.title || !req.body.text) {
        res.status(403).send(`Required paramater missing`);
        return;
    };
    
   try{
    const insertPost = await col.insertOne({
    id: nanoid(),
    title: req.body.title,
    text: req.body.text,
   });
   console.log("insertPost ", insertPost);
   res.status(200).send('Post created successfully!');
}
   catch(e){
    console.log("Error in Mongodb ", e);
    res.status(500).send("Server Error. Try again later!")
   }
})

router.get('/posts', async (req, res, next) => {
    console.log('Get all posts!', new Date());
    const cursor = col.find({});
    try{
        let results = await cursor.toArray();
        console.log("results: ", results);
        res.send(results);
    }catch(e){
        console.log("Error in Mongodb ", e);
        res.status(500).send("Server Error. Try again later!")
    }
})

router.get('/post/:postId', (req, res, next) => {
    console.log('Finding a post!', new Date());

    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id === req.params.postId) {
            res.status(200).send(posts[i]);
            return;
        }
    }

    res.status(403).send('Post not found with id ' + req.params.postId);
})
router.put('/post/:postId', (req, res, next) => {

    if (!req.params.postId
        || !req.body.text
        || !req.body.title) {
        res.status(403).send(`example put body: 
        PUT     /api/v1/post/:postId
        {
            title: "updated title",
            text: "updated text"
        }
        `)
    }

    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id === req.params.postId) {
            posts[i] = {
                title: req.body.title,
                text: req.body.text,
            }
            res.send('post updated with id ' + req.params.postId);
            return;
        }
    }
    res.send('post not found with id ' + req.params.postId);
})
router.delete('/post/:postId', (req, res, next) => {
    console.log('Finding a post!', new Date());

    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id === req.params.postId) {
            res.status(200).send("Post deleted successfully")
            posts.splice(i, 1);
            return;
        }
    }
    res.status(403).send('Post not found with id ' + req.params.postId);
})

export default router