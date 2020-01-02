const express = require("express");
const mongoose = require("mongoose");

const applications = require("./routes/api/applications");

const app = express();
app.use(express.json());

// DB Congig
const db = require("./config/keys").mongoURI;

// Connect to Mongo
mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("MongoDB connected..."))
  .catch(err => console.log(err));

// Use Routes
app.use("/api/applications", applications);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
