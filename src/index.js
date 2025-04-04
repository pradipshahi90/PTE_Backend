import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from './routes/authRoutes.js';
import { protect, admin } from './middleware/authMiddleware.js';
import cors from 'cors';
import materialRoutes from "./routes/materialRoutes.js";


dotenv.config(); // Load .env variables

connectDB(); // Connect to MongoDB

const app = express();

// Enable CORS for requests from frontend
app.use(cors({
    origin: 'http://localhost:5173',  // Allow requests from Vite frontend
    methods: 'GET,POST,PUT,DELETE',
    credentials: true  // Allow cookies if needed
}));

app.use(express.json()); // Middleware for JSON parsing

app.get("/", (req, res) => {
    res.send("API is running...");
});
// Routes
app.use('/api/auth', authRoutes);


// Example of a protected route (only accessible by admin)
app.get('/api/admin', protect, admin, (req, res) => {
    res.json({ message: 'Welcome, admin' });
});
app.use('/api/reading-materials', materialRoutes);



const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
