const express = require("express");

const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config();
const connectToMongoDb = require("./config/db");
const path = require("path");

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

// Assuming your images are in the "uploads" folder inside the "tmp" folder
const uploadsPath = path.join(__dirname, 'tmp', 'uploads');

// Serve static files from the "uploads" folder
app.use('/uploads', express.static(uploadsPath));

app.use("/api/users",userRoutes);
app.use("/api/blogs",blogRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);

  // Send a generic error response to the client
  res.status(500).send('Something went wrong!');
});
const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
});

