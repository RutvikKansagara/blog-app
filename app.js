const express = require("express");

const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config();
const connectToMongoDb = require("./config/db");


const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

// Set up CORS to allow only specific origins
// const corsOptions = {
//     origin: "http://localhost:3000", 
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true, 
//     optionsSuccessStatus: 204, 
//   };
// app.use(cors(corsOptions));

connectToMongoDb();

app.use("/uploads",express.static("uploads"));
app.get("/",(req,res)=>{
  res.status.json({sucess:true,message:"hello"});
})
app.use("/api/users",userRoutes);
app.use("/api/blogs",blogRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
});

