import 'dotenv/config'
import cors from "cors"
import helmet from "helmet"
import express from "express"
import connectMongoDB from './config/db.js'
import morgan from "morgan"

import postsRouter from './routes/posts.js'
import authRouter from './routes/auth.js'
import userRouter from './routes/users.js'
import errorHandler from './middlewares/errorHandler.js'

const app = express()
const PORT = process.env.PORT || 5000
await connectMongoDB();

//MiddleWares
app.use(morgan("dev"));
app.use(helmet()); 
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Routes
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter);
app.use('/api/posts', postsRouter);

//Error Handler MiddleWare
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server started at ${process.env.PORT}`))