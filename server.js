const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const applications = require("./routes/api/applications");

const app = express();
app.use(express.json());

// DB Congig
if (process.env.NODE_ENV === " production") process.env.mongoURI;
else const db = require("./config/keys").mongoURI;

// Connect to Mongo
mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("MongoDB connected..."))
  .catch(err => console.log(err));

// Use Routes
app.use("/api/applications", applications);

// Serve static assets if in production
if (process.env.NODE_ENV === " production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
