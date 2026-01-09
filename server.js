require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require("./routes/authRoute");

// Validate required environment variables
if (!process.env.MONGO_URL || !process.env.PORT || !process.env.JWT_SECRET) {
    console.error('Error: Missing required environment variables (MONGO_URL, PORT, JWT_SECRET)');
    process.exit(1);
}

const app = express();
app.use(cors())
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB is Connected"))
    .catch(error => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    });

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))