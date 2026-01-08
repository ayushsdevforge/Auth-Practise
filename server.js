require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require("./routes/authRoute");

const app = express();
app.use(cors())
app.use(express.json());

mongoose.connect(process.env.MONGO_URL).then(()=> console.log("MongoDb is Connected")).catch(error => console.log(error));
app.use('/api/auth', authRoutes);
const PORT = process.env.PORT
app.listen(PORT, console.log(`Server is running on Port ${PORT}`))