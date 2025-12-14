import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
let db;
const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not set! Running in demo mode without database.');
    return null;
  }
  
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db('budget');
    console.log('Connected to MongoDB');
    
    // Create index for faster lookups
    await db.collection('profiles').createIndex({ name: 1 }, { unique: true });
    
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return null;
  }
}

// API Routes

// Get all profile names (for selector dropdown)
app.get('/api/profiles', async (req, res) => {
  try {
    if (!db) {
      return res.json([]);
    }
    
    const profiles = await db.collection('profiles')
      .find({}, { projection: { name: 1, createdAt: 1 } })
      .sort({ name: 1 })
      .toArray();
    
    res.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
});

// Create a new profile
app.post('/api/profiles', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    
    const { name, pin, scenarios } = req.body;
    
    if (!name || !pin) {
      return res.status(400).json({ error: 'Name and PIN are required' });
    }
    
    if (pin.length < 4 || pin.length > 6 || !/^\d+$/.test(pin)) {
      return res.status(400).json({ error: 'PIN must be 4-6 digits' });
    }
    
    // Check if profile name already exists
    const existing = await db.collection('profiles').findOne({ name });
    if (existing) {
      return res.status(409).json({ error: 'Profile name already exists' });
    }
    
    // Hash the PIN
    const hashedPin = await bcrypt.hash(pin, 10);
    
    const profile = {
      name,
      pin: hashedPin,
      scenarios: scenarios || getDefaultScenarios(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await db.collection('profiles').insertOne(profile);
    
    res.status(201).json({
      _id: result.insertedId,
      name: profile.name,
      scenarios: profile.scenarios,
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

// Login to a profile (verify PIN)
app.post('/api/profiles/login', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    
    const { name, pin } = req.body;
    
    if (!name || !pin) {
      return res.status(400).json({ error: 'Name and PIN are required' });
    }
    
    const profile = await db.collection('profiles').findOne({ name });
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    const isValid = await bcrypt.compare(pin, profile.pin);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid PIN' });
    }
    
    res.json({
      _id: profile._id,
      name: profile.name,
      scenarios: profile.scenarios,
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Update a profile's scenarios (auto-save)
app.put('/api/profiles/:id', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    
    const { id } = req.params;
    const { scenarios } = req.body;
    
    if (!scenarios) {
      return res.status(400).json({ error: 'Scenarios data required' });
    }
    
    const result = await db.collection('profiles').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          scenarios,
          updatedAt: new Date(),
        }
      }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Delete a profile
app.delete('/api/profiles/:id', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    
    const { id } = req.params;
    const { pin } = req.body;
    
    // Verify PIN before deletion
    const profile = await db.collection('profiles').findOne({ _id: new ObjectId(id) });
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    const isValid = await bcrypt.compare(pin, profile.pin);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid PIN' });
    }
    
    await db.collection('profiles').deleteOne({ _id: new ObjectId(id) });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ error: 'Failed to delete profile' });
  }
});

// Default scenarios for new profiles
function getDefaultScenarios() {
  return {
    current: {
      name: 'Current Reality',
      income: [],
      expenses: [],
      debts: [],
      goals: [],
    },
    plan: {
      name: 'Plan Budget',
      income: [],
      expenses: [],
      debts: [],
      goals: [],
    },
  };
}

// Serve static files in production
if (process.env.NODE_ENV === 'production' || !process.env.VITE_DEV) {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

