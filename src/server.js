import 'dotenv/config'
import express from "express"
import connectMongoDB from './config/db.js'

const app = express()

//Database Connection
connectMongoDB(process.env.MONGODB_URI)
.then(()=> console.log('MongoDB connected'))

app.listen(process.env.PORT, ()=> console.log(`Server started at ${process.env.PORT}`))