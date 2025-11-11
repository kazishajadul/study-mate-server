// // server/index.js
// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const app = express();

// // Middleware
// app.use(express.json());

// // --- Configuration ---
// const MONGO_URI =
//   process.env.MONGO_URI ||
//   'mongodb+srv://studymate:pTiEnGyQAh8UIveU@kazirafan.f2skk7f.mongodb.net/StudyMateDB?retryWrites=true&w=majority';

// const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
// app.use(cors({ origin: CLIENT_ORIGIN }));

// // --- Connect to MongoDB ---
// mongoose
//   .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log('✅ MongoDB connected');
//     console.log(`📦 Connected to database: ${mongoose.connection.name}`);
//   })
//   .catch((err) => {
//     console.error('❌ MongoDB connection error:', err.message);
//     process.exit(1);
//   });

// // --- Mongoose Schemas ---
// const { Schema, model } = mongoose;

// const PartnerSchema = new Schema(
//   {
//     id: { type: String },
//     name: { type: String, required: true },
//     profileimage: { type: String, default: '' },
//     subject: { type: String, required: true },
//     studyMode: { type: String, enum: ['Online', 'Offline'], default: 'Online' },
//     availabilityTime: { type: String, default: '' },
//     location: { type: String, default: '' },
//     experienceLevel: {
//       type: String,
//       enum: ['Beginner', 'Intermediate', 'Expert'],
//       default: 'Beginner',
//     },
//     rating: { type: Number, default: 0 },
//     patnerCount: { type: Number, default: 0 },
//     email: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// const RequestSchema = new Schema(
//   {
//     partnerId: { type: Schema.Types.ObjectId, ref: 'Partner', required: true },
//     partnerSnapshot: { type: Schema.Types.Mixed, required: true },
//     requesterEmail: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// const Partner = model('Partner', PartnerSchema);
// const Request = model('Request', RequestSchema);

// // --- API Endpoints ---

// // ✅ Get all partners
// app.get('/api/partners', async (req, res) => {
//   try {
//     const { search, sort } = req.query;
//     const filter = {};

//     if (search) {
//       filter.$or = [
//         { subject: { $regex: search, $options: 'i' } },
//         { name: { $regex: search, $options: 'i' } },
//         { location: { $regex: search, $options: 'i' } },
//       ];
//     }

//     let query = Partner.find(filter);

//     if (sort === 'Beginner') query = query.sort({ experienceLevel: 1 });
//     else if (sort === 'Expert') query = query.sort({ experienceLevel: -1 });
//     else query = query.sort({ rating: -1, createdAt: -1 });

//     const partners = await query.exec();
//     res.json({ success: true, data: partners });
//   } catch (err) {
//     console.error('Error fetching partners:', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // ✅ Get single partner by ID
// app.get('/api/partners/:id', async (req, res) => {
//   try {
//     const partner = await Partner.findById(req.params.id);
//     if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });
//     res.json({ success: true, data: partner });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // ✅ Create a new partner
// app.post('/api/partners', async (req, res) => {
//   try {
//     const newPartner = await Partner.create(req.body);
//     res.status(201).json({ success: true, data: newPartner });
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({ success: false, message: err.message });
//   }
// });

// // ✅ Update a partner
// app.put('/api/partners/:id', async (req, res) => {
//   try {
//     const updated = await Partner.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
//     res.json({ success: true, data: updated });
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({ success: false, message: err.message });
//   }
// });

// // ✅ Delete a partner
// app.delete('/api/partners/:id', async (req, res) => {
//   try {
//     await Partner.findByIdAndDelete(req.params.id);
//     res.json({ success: true, message: 'Deleted' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // ✅ Send request to a partner
// app.post('/api/requests', async (req, res) => {
//   try {
//     const { partnerId, partnerSnapshot, requesterEmail } = req.body;
//     if (!partnerId || !partnerSnapshot || !requesterEmail)
//       return res.status(400).json({ success: false, message: 'Missing data' });

//     const exists = await Request.findOne({ partnerId, requesterEmail });
//     if (exists) return res.status(400).json({ success: false, message: 'Request already sent' });

//     const newReq = await Request.create({ partnerId, partnerSnapshot, requesterEmail });
//     await Partner.findByIdAndUpdate(partnerId, { $inc: { patnerCount: 1 } });

//     res.status(201).json({ success: true, data: newReq });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // ✅ Get all requests for a user
// app.get('/api/requests/:email', async (req, res) => {
//   try {
//     const docs = await Request.find({ requesterEmail: req.params.email }).sort({ createdAt: -1 });
//     res.json({ success: true, data: docs });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // ✅ Delete a request
// app.delete('/api/requests/:id', async (req, res) => {
//   try {
//     await Request.findByIdAndDelete(req.params.id);
//     res.json({ success: true, message: 'Deleted' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // ✅ Developer helper: Seed demo data
// app.post('/api/seed-demo', async (req, res) => {
//   try {
//     const demo = req.body;
//     if (!Array.isArray(demo))
//       return res.status(400).json({ success: false, message: 'Send an array' });

//     await Partner.deleteMany({});
//     const created = await Partner.insertMany(demo);
//     res.json({ success: true, inserted: created.length });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // ✅ Migration helper
// app.post('/api/migrate-normalize', async (req, res) => {
//   try {
//     const all = await Partner.find({});
//     const ops = all.map((p) => {
//       const update = {};
//       if (p.profileimage && !p.profileImage) update.profileImage = p.profileimage;
//       if (typeof p.patnerCount !== 'undefined' && typeof p.partnerCount === 'undefined')
//         update.partnerCount = p.patnerCount;
//       if (Object.keys(update).length) return Partner.findByIdAndUpdate(p._id, { $set: update });
//       return Promise.resolve();
//     });
//     await Promise.all(ops);
//     res.json({ success: true, message: 'Migration completed' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // ✅ Root route
// app.get('/', (req, res) => res.send('StudyMate server is running 🚀'));

// // ✅ Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`⚙️ Server running on port ${PORT}`));


// server/index.js
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
    console.log('✅ MongoDB connected');
    console.log(`📦 Connected to database: ${mongoose.connection.name}`);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
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

// --- API Endpoints ---

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

// Root route
app.get('/', (req, res) => res.send('StudyMate server is running 🚀'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`⚙️ Server running on port ${PORT}`));

