import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './database/mongodb.js';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/error.middleware.js'
import authorize from './middlewares/auth.middleware.js';
import authRouter from './routes/auth.route.js';
import todosRouter from './routes/todos.routes.js'


dotenv.config();
const app = express()

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use("/api/auth", authRouter);


app.use("/api/todos", authorize, todosRouter)


app.use(errorHandler)

app.listen(process.env.PORT, ()=>{
    connectDB();
    console.log(`App is running in http://localhost:${process.env.PORT}`);
})
