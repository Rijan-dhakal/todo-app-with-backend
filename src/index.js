import express from 'express'
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

const PORT = process.env.PORT || 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



app.use("/api/auth", authRouter);

app.use("/api/todos", authorize, todosRouter)

app.use('/todo',authorize, express.static(path.join(__dirname, 'protected')));

app.use('/register', express.static(path.join(__dirname, 'public', 'register')));

app.use('/otp', express.static(path.join(__dirname, 'public', 'otp')));

app.use('/login', express.static(path.join(__dirname, 'public', 'login')));

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
}, 7 * 60 * 1000); 

app.listen(PORT, ()=>{
    connectDB();
    console.log(`App is running in http://localhost:${PORT}`);
})
