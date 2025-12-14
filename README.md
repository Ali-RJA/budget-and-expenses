# Budget Dashboard

A beautiful, responsive personal budget dashboard built with React. Track your income, expenses, debts, and savings goals with cloud sync and profile support.

## Features

- **Multi-Profile Support**: Create multiple profiles with PIN protection - perfect for sharing with friends/family
- **Cloud Sync**: All changes auto-saved to MongoDB - access your budget from anywhere
- **Dual Scenario Tracking**: Compare "Current Reality" vs "Plan Budget"
- **Income Management**: Track multiple income sources
- **Expense Tracking**: Categorize expenses as fixed or variable
- **Debt Management**: Drag-and-drop prioritization with payoff projections
- **Savings Goals**: Track progress toward emergency fund, vacation, etc.
- **Beautiful Charts**: Spending breakdown, cash flow, debt payoff timeline
- **Import/Export**: Save and load your budget as JSON files
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: React 18 + Vite, Tailwind CSS, Recharts, @dnd-kit
- **Backend**: Express.js, MongoDB
- **Auth**: PIN-based (bcrypt hashed)

## Local Development

```bash
# Install dependencies
npm install

# Create .env file with your MongoDB URI
echo "MONGODB_URI=your_mongodb_connection_string" > .env

# Start dev server (runs both client and server)
npm run dev
```

The app will be available at `http://localhost:5173` (Vite) with API proxy to `http://localhost:3001` (Express).

## Deployment on Railway

1. Push code to GitHub
2. Connect repo to Railway
3. Add environment variable:
   - `MONGODB_URI` = your MongoDB Atlas connection string
4. Deploy!

Railway will automatically detect the Node.js app and run `npm run build` then `npm start`.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string (required) |
| `PORT` | Server port (auto-set by Railway) |

## Profile System

- Each profile has a name and 4-6 digit PIN
- PINs are hashed with bcrypt (not stored in plain text)
- Each profile has its own "Current Reality" and "Plan Budget" scenarios
- Data auto-saves to MongoDB 1 second after each change

## Data Storage

- **Cloud**: All profile data stored in MongoDB Atlas
- **Local**: Only theme preference stored in localStorage
- **Export**: Download your budget as a `.json` file for backup
- **Import**: Load a previously exported `.json` file

## License

MIT
