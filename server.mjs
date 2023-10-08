import express from 'express';
import path from 'path';
const __dirname = path.resolve();

import authRouter from './routes/auth.mjs'
import commentRouter from './routes/comment.mjs'
import feedRouter from './routes/feed.mjs'
import postRouter from './routes/post.mjs'

const app = express();
app.use(express.json());
app.use("/api/v1", authRouter)


app.use((req, res, next) => {
    const token = "valid";
    if (token === "valid") {
        next();
    } else {
        res.send({ message: "invalid token" })
    }
})


app.use("/api/v1", commentRouter)
app.use("/api/v1", postRouter)
app.use("/api/v1", feedRouter)

app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Example server listening on port ${PORT}`)
})
