import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors' // Ajoutez cette importation
import connDB from './config/connDB.js'
import authRoutes from './routes/auth.route.js'

dotenv.config();
connDB();

const app = express();

// Configurez CORS avant les autres middlewares
app.use(cors({
  origin: 'http://localhost:5173', // Your Vite frontend URL
  credentials: true // If you're using cookies/auth headers
}));

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));