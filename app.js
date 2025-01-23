const express = require('express');
const cors = require('cors'); // Import CORS
require('dotenv').config(); // Load environment variables
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes'); 
const taskRoutes = require('./routes/taskRoutes');

// Initialize the app
const app = express();

// Connect to MongoDB Database
connectDB();

// Middleware for parsing JSON
app.use(express.json());

// Add this line to enable CORS for all routes, for F/B Development.
app.use(cors());


//Base Route
app.get('/', (req, res) =>{
    res.send('TaskMaster API is running...');
});

// API routes
// console.log(app._router.stack); // This will log all registered routes
app.use('/api/auth', authRoutes); 
app.use('/api/tasks', taskRoutes); 

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>{
    console.log(`Server is running on ${PORT}`)
})