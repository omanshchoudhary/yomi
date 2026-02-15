import 'dotenv/config'
import cors from "cors"
import helmet from "helmet"
import express from "express"
import connectMongoDB from './config/db.js'
import morgan from "morgan"
import rateLimit from "express-rate-limit"


import postsRouter from './routes/posts.js'
import authRouter from './routes/auth.js'
import userRouter from './routes/users.js'
import errorHandler from './middlewares/errorHandler.js'

const app = express()
const PORT = process.env.PORT || 5000
await connectMongoDB();


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  
  max: 100,                   
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,      
  legacyHeaders: false,       
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many attempts." },
  standardHeaders: true,
  legacyHeaders: false,
});

//MiddleWares

app.use(morgan("dev"));
app.use(helmet()); 
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(limiter);  
}


//Routes
if (process.env.NODE_ENV === 'test') {
  app.use('/api/auth', authRouter)
} else {
  app.use('/api/auth',authLimiter, authRouter)
}
app.use('/api/users', userRouter);
app.use('/api/posts', postsRouter);

//Error Handler MiddleWare
app.use(errorHandler)

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server started at ${process.env.PORT}`))
}

export default app;