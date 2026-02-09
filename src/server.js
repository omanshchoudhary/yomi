import 'dotenv/config'
import express from "express"
import connectMongoDB from './config/db.js'

import postsRouter from './routes/posts.js'
import authRouter from './routes/auth.js'
const app = express()
const PORT = process.env.PORT || 5000
await connectMongoDB();

//MiddleWares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Routes
app.use('/api/auth', authRouter)
app.use('/api/posts', postsRouter);



app.listen(PORT, () => console.log(`Server started at ${process.env.PORT}`))