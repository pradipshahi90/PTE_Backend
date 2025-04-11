import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from './routes/authRoutes.js';
import materialRoutes from "./routes/materialRoutes.js";
import cors from 'cors';
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

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

app.get("/", (req, res) => {
    res.send("API is running...");
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', userRoutes);
app.use('/api/reading-materials', materialRoutes);
app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));