require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());

// --- Configuration ---
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://studymate:pTiEnGyQAh8UIveU@kazirafan.f2skk7f.mongodb.net/StudyMateDB?retryWrites=true&w=majority';

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: CLIENT_ORIGIN }));

// --- Connect to MongoDB ---
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    console.log(`Connected to database: ${mongoose.connection.name}`);
  })
  .catch((err) => {
    console.error(' MongoDB connection error:', err.message);
    process.exit(1);
  });

// --- Mongoose Schemas ---
const { Schema, model } = mongoose;

const PartnerSchema = new Schema(
  {
    id: { type: String },
    name: { type: String, required: true },
    profileimage: { type: String, default: '' },
    subject: { type: String, required: true },
    studyMode: { type: String, enum: ['Online', 'Offline'], default: 'Online' },
    availabilityTime: { type: String, default: '' },
    location: { type: String, default: '' },
    experienceLevel: {
      type: String,
      enum: ['Beginner','Intermediate','Expert'],
      default:'Beginner'
    },
    rating: { type: Number, default: 0 },
    patnerCount: { type: Number, default: 0 },
    email: { type: String, required: true },
  },
  { timestamps: true }
);


const Partner = model('Partner', PartnerSchema);


// Get all partners
app.get('/api/partners', async (req, res) => {
  try {
    const partners = await Partner.find({}).sort({ rating: -1, createdAt: -1 });
    res.json({ success: true, data: partners });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


app.get('/', (req, res) => res.send('StudyMate server is running 🚀'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`⚙️ Server running on port ${PORT}`));

