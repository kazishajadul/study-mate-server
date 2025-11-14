import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { dbName: "studymate" })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

// Partner Schema
const partnerSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    profileimage: String,
    subject: String,
    studyMode: String,
    availabilityTime: String,
    location: String,
    experienceLevel: String,
    rating: Number,
    patnerCount: Number,
    email: String,
  },
  { versionKey: false }
);

// ⚠ Specify the exact collection name to match MongoDB
const Partner = mongoose.model("Partner", partnerSchema, "StudyMateDB");

// Home route
app.get("/", (req, res) => {
  res.json({ status: "success", message: "StudyMate Server Running" });
});

// GET all tutors
app.get("/apps", async (req, res) => {
  try {
    const apps = await Partner.find({});
    res.json({ success: true, data: apps });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to fetch apps" });
  }
});

// GET single tutor by custom id
app.get("/apps/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const app = await Partner.findOne({ id: id }); // search by your string "id"
    if (!app) return res.status(404).json({ success: false, error: "App not found" });
    res.json({ success: true, data: app });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ status: 404, error: "API Not Found" });
});

app.listen(port, () => console.log(`🌐 Server running on http://localhost:${port}`));
