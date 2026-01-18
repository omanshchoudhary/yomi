import 'dotenv/config'
import express from "express"
import connectMongoDB from './config/db.js'
import postsRouter from './routes/posts.js'

const app = express()

//Database Connection
connectMongoDB(process.env.MONGODB_URI)
.then(()=> console.log('MongoDB connected'))


//Routes
app.use('/api/posts', postsRouter);

app.get('/test', (req,res)=>{
    res.send('Hi Naughty Boy')
})



app.listen(process.env.PORT, ()=> console.log(`Server started at ${process.env.PORT}`))