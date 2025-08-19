const express = require("express");
const dotenv = require('dotenv');
const cors = require("cors")
const connectDB = require("./config/database");
const morgan = require('morgan')
const authRoutes = require("./routes/authRoutes")
const productRoutes = require("./routes/productRoutes")
const cartRoutes = require("./routes/cartRoutes")

//config.env
dotenv.config();

//databse
connectDB()

//server
const app = express();
//middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }));  
app.use(express.json())
app.use(morgan("dev"));

//Routes
app.use("/api/v1",productRoutes)
app.use("/api/auth",authRoutes);
app.use("/api/cart",cartRoutes);

app.get("/", (req, res) => {
  res.send("Myntra Clone Backend is running 🚀");
});


//Port
const PORT = process.env.PORT || 3000
app.listen(PORT,()=>console.log(`server running on port ${PORT}`))