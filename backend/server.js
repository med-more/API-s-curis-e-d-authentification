const express = require('express');
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
connectDb();
const app = express();

app.use(cors()); 
app.use(express.json()); 
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀Server running on port ${PORT}`));