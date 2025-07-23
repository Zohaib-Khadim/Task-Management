const express = require("express");
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const authRoutes =require("./routes/authRoutes")
const taskRoutes =require("./routes/taskRoutes")
const userRoutes =require("./routes/userRoutes")
dotenv.config();

app.use(express.json());
app.use(cors())
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});