import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get('/health',(_req,res)=>{
    res.json({status:'Server is running'});
});


app.use('/api/auth', authRoutes);


connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server running on port ${PORT}`);
    });
});