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



connectToMongoDb();

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve static files from the '/tmp/uploads' directory
app.use("/tmp/uploads", express.static(path.join(__dirname, "/tmp/uploads")));

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

