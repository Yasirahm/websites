const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Schema
const websiteSchema = new mongoose.Schema({
  title: String,
  url: String,
}, { timestamps: true });

const Website = mongoose.model("Website", websiteSchema);

// Routes

// Get all
app.get("/api/websites", async (req, res) => {
  const websites = await Website.find().sort({ createdAt: -1 });
  res.json(websites);
});

// Add
app.post("/api/websites", async (req, res) => {
  const { title, url } = req.body;
  const newWebsite = new Website({ title, url });
  await newWebsite.save();
  res.json({ message: "Added" });
});

// Update
app.put("/api/websites/:id", async (req, res) => {
  await Website.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Updated" });
});

// Delete
app.delete("/api/websites/:id", async (req, res) => {
  await Website.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

app.listen(process.env.PORT, () =>
  console.log("Server running")
);
