import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from './routes/authRoutes.js';
import materialRoutes from "./routes/materialRoutes.js";
import cors from 'cors';
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import speakingRoutes from "./routes/speakingRoutes.js";
import examResults from "./routes/examResults.js";

import examResults from "./routes/examResults.js";
import path from 'path';
import courseRoutes from "./routes/courseRoute.js";



dotenv.config(); // Load .env variables

connectDB(); // Connect to MongoDB

const app = express();

// Enable CORS for requests from frontend
app.use(cors({
    origin: 'http://localhost:5173',  // Allow requests from Vite frontend
    methods: 'GET,POST,PUT,DELETE,PATCH', // Added PATCH for toggle-status
    credentials: true  // Allow cookies if needed
}));

app.use(express.json()); // Middleware for JSON parsing

// ✅ Serve static files from the /uploads folder
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get("/", (req, res) => {
    res.send("API is running...");
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', userRoutes);
app.use('/api/reading-materials', materialRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/speaking', speakingRoutes);
app.use('/api/exam-results', examResults);
app.use('/api/courses',courseRoutes)



const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));