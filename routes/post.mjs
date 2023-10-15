import express from 'express';
import { ObjectId } from 'mongodb';
import {client} from './../mongodb.mjs';
import moment from 'moment';
const db = client.db("crudop");
const col = db.collection("posts");
let router = express.Router()

router.post('/post', async (req, res, next) => {
    console.log('Create a Post!', new Date());

    if (!req.body.title || !req.body.text) {
        res.status(403).send(`Required paramater missing`);
        return;
    };
    
   try{
    const insertPost = await col.insertOne({
    title: req.body.title,
    text: req.body.text,
    createdAt: moment().format('MMMM Do YYYY, h:mm:ss a'),
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
    const cursor = col.find({}).sort({_id:-1}).limit(100);
    try{
        let results = await cursor.toArray();
        console.log("results: ", results);
        res.send(results);
    }catch(e){
        console.log("Error in Mongodb ", e);
        res.status(500).send("Server Error. Try again later!")
    }
})

router.get('/post/:postId', async(req, res, next) => {
    console.log('Finding a post!', new Date());

    if(ObjectId.isValid(req.params.postId) == false){
        res.status(403).send("Post id must be a valid number!!");
        console.log("Post id doesnot match!")
        return;
    }

    try{
        let result = await col.findOne({_id : new ObjectId(req.params.postId) });
        console.log("Result : ", result);
        res.send(result);
    }catch(e){
        console.log("Error in Mongodb ", e);
        res.status(500).send("Server Error. Try again later!")
    }
})
router.put('/post/:postId', async(req, res, next) => {
    const postId = new ObjectId(req.params.postId);
    const { title, text } = req.body;

    if (!title || !text) {
        res.status(403).send('Required parameters missing. Please provide both "title" and "text".');
        return;
    }

    try {
        const updateResponse = await col.updateOne({ _id: postId }, { $set: { title, text } });

        if (updateResponse.matchedCount === 1) {
            res.send(`Post with id ${postId} updated successfully.`);
        } else {
            res.send('Post not found with the given id.');
        }
    } catch (error) {
        console.error(error);
    }
})
router.delete('/post/:postId', async (req, res, next) => {
    console.log('Finding a post!', new Date());
    if(!ObjectId.isValid(req.params.postId)){
        res.status(403).send("Post id must be a valid number!!");
        console.log("Post id doesnot match!")
        return;
    }
    try {
        const deleteResponse = await col.deleteOne({ _id: new ObjectId(req.params.postId) });
        if (deleteResponse.deletedCount === 1) {
            res.send(`Post with id ${req.params.postId} deleted successfully.`);
            console.log("Post deleted successfully!")
        }else {
            console.log("Post not found with the given id.");
            res.status(500).status('Server Error ! Try again later..')
        }
    } catch (error) {
        console.error(error);
    }

});

router.delete('/posts/all', async (req, res, next) => {
    try{
        const deleteResponse = await col.deleteMany({});
        if(deleteResponse.deletedCount > 0){
            res.send(`All posts deleted successfully!`);
        }else{
            res.send(`No posts found to delete!`);
        }}
        catch(e){
            console.log("Error in Mongodb ", e);
            res.status(500).send("Server Error. Try again later!")
        };
    });
    

export default router