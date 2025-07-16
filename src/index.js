import express from 'express'
import cors from 'cors'
import path from "path"
import dotenv from 'dotenv'
import { fileURLToPath } from 'url';
import connectDB from './database/mongodb.js';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/error.middleware.js'
import authorize from './middlewares/auth.middleware.js';
import authRouter from './routes/auth.route.js';
import todosRouter from './routes/todos.routes.js'
import OTP from './models/otp.model.js';


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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



app.use("/api/auth", authRouter);


app.use("/api/todos", todosRouter)

app.use('/todo',authorize, express.static(path.join(__dirname, 'protected')));

app.use('/register', express.static(path.join(__dirname, 'public', 'register')));

 app.get('/',authorize, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'todoMain','index.html'));
  });

app.use(errorHandler)

// Cleanup expired users every 15 minutes
setInterval(async () => {
    try {
        await OTP.cleanupExpiredUsers();
    } catch (error) {
        console.error('Cleanup failed:', error);
    }
}, 15 * 60 * 1000); 

app.listen(process.env.PORT, ()=>{
    connectDB();
    console.log(`App is running in http://localhost:${process.env.PORT}`);
})
