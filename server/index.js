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

// Default template scenario with $0 values - ready to fill in
function createTemplateScenario(name) {
  return {
    name,
    income: [
      { id: 'inc-1', name: 'Primary Salary', type: 'salary', amount: 0 },
      { id: 'inc-2', name: 'Side Income', type: 'freelance', amount: 0 },
      { id: 'inc-3', name: 'Investment Returns', type: 'investments', amount: 0 },
    ],
    expenses: [
      // Housing
      { id: 'exp-1', name: 'Rent/Mortgage', category: 'housing', amount: 0, isFixed: true },
      { id: 'exp-2', name: 'Property Tax', category: 'housing', amount: 0, isFixed: true },
      { id: 'exp-3', name: 'HOA Fees', category: 'housing', amount: 0, isFixed: true },
      // Utilities
      { id: 'exp-4', name: 'Electric', category: 'utilities', amount: 0, isFixed: false },
      { id: 'exp-5', name: 'Gas/Heating', category: 'utilities', amount: 0, isFixed: false },
      { id: 'exp-6', name: 'Water/Sewer', category: 'utilities', amount: 0, isFixed: false },
      { id: 'exp-7', name: 'Internet', category: 'utilities', amount: 0, isFixed: true },
      { id: 'exp-8', name: 'Phone', category: 'utilities', amount: 0, isFixed: true },
      // Food
      { id: 'exp-9', name: 'Groceries', category: 'food', amount: 0, isFixed: false },
      { id: 'exp-10', name: 'Dining Out', category: 'food', amount: 0, isFixed: false },
      // Transportation
      { id: 'exp-11', name: 'Car Payment', category: 'transport', amount: 0, isFixed: true },
      { id: 'exp-12', name: 'Gas/Fuel', category: 'transport', amount: 0, isFixed: false },
      { id: 'exp-13', name: 'Car Insurance', category: 'transport', amount: 0, isFixed: true },
      { id: 'exp-14', name: 'Maintenance/Repairs', category: 'transport', amount: 0, isFixed: false },
      { id: 'exp-15', name: 'Public Transit', category: 'transport', amount: 0, isFixed: false },
      // Insurance
      { id: 'exp-16', name: 'Health Insurance', category: 'insurance', amount: 0, isFixed: true },
      { id: 'exp-17', name: 'Life Insurance', category: 'insurance', amount: 0, isFixed: true },
      { id: 'exp-18', name: 'Renters/Home Insurance', category: 'insurance', amount: 0, isFixed: true },
      // Healthcare
      { id: 'exp-19', name: 'Medical/Doctor', category: 'healthcare', amount: 0, isFixed: false },
      { id: 'exp-20', name: 'Prescriptions', category: 'healthcare', amount: 0, isFixed: false },
      { id: 'exp-21', name: 'Dental', category: 'healthcare', amount: 0, isFixed: false },
      // Personal
      { id: 'exp-22', name: 'Clothing', category: 'shopping', amount: 0, isFixed: false },
      { id: 'exp-23', name: 'Personal Care', category: 'personal', amount: 0, isFixed: false },
      { id: 'exp-24', name: 'Gym/Fitness', category: 'personal', amount: 0, isFixed: true },
      // Entertainment
      { id: 'exp-25', name: 'Entertainment', category: 'entertainment', amount: 0, isFixed: false },
      { id: 'exp-26', name: 'Streaming Services', category: 'subscriptions', amount: 0, isFixed: true },
      { id: 'exp-27', name: 'Subscriptions', category: 'subscriptions', amount: 0, isFixed: true },
      // Other
      { id: 'exp-28', name: 'Pet Expenses', category: 'other', amount: 0, isFixed: false },
      { id: 'exp-29', name: 'Childcare', category: 'other', amount: 0, isFixed: true },
      { id: 'exp-30', name: 'Miscellaneous', category: 'other', amount: 0, isFixed: false },
    ],
    debts: [
      { id: 'debt-1', name: 'Credit Card 1', type: 'credit_card', balance: 0, interestRate: 19.99, minimumPayment: 0, extraPayment: 0, order: 0 },
      { id: 'debt-2', name: 'Credit Card 2', type: 'credit_card', balance: 0, interestRate: 22.99, minimumPayment: 0, extraPayment: 0, order: 1 },
      { id: 'debt-3', name: 'Student Loan', type: 'student_loan', balance: 0, interestRate: 5.8, minimumPayment: 0, extraPayment: 0, order: 2 },
      { id: 'debt-4', name: 'Auto Loan', type: 'auto_loan', balance: 0, interestRate: 6.5, minimumPayment: 0, extraPayment: 0, order: 3 },
      { id: 'debt-5', name: 'Personal Loan', type: 'personal_loan', balance: 0, interestRate: 10.0, minimumPayment: 0, extraPayment: 0, order: 4 },
    ],
    goals: [
      { id: 'goal-1', name: 'Emergency Fund (3 months)', type: 'emergency', targetAmount: 0, currentAmount: 0, monthlyContribution: 0, order: 0 },
      { id: 'goal-2', name: 'Debt Payoff', type: 'debt_free', targetAmount: 0, currentAmount: 0, monthlyContribution: 0, order: 1 },
      { id: 'goal-3', name: 'Vacation', type: 'vacation', targetAmount: 0, currentAmount: 0, monthlyContribution: 0, order: 2 },
      { id: 'goal-4', name: 'Retirement', type: 'retirement', targetAmount: 0, currentAmount: 0, monthlyContribution: 0, order: 3 },
    ],
  };
}

// Default scenarios for new profiles
function getDefaultScenarios() {
  return {
    current: createTemplateScenario('Current Reality'),
    plan: createTemplateScenario('Plan Budget'),
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

