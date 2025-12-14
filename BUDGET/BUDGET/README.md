# Budget Dashboard

A beautiful, responsive personal budget dashboard built with React. Track your income, expenses, debts, and savings goals with auto-saving and import/export functionality.

## Features

- **Dual Scenario Tracking**: Compare "Current Reality" vs "Plan Budget"
- **Income Management**: Track multiple income sources
- **Expense Tracking**: Categorize expenses as fixed or variable
- **Debt Management**: Drag-and-drop prioritization with payoff projections
- **Savings Goals**: Track progress toward emergency fund, vacation, etc.
- **Beautiful Charts**: Spending breakdown, cash flow, debt payoff timeline
- **Auto-Save**: All changes saved to browser localStorage
- **Import/Export**: Save and load your budget as JSON files
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- Recharts (charts)
- @dnd-kit (drag and drop)
- Lucide React (icons)

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Railway

This project is configured for one-click Railway deployment:

1. Connect your GitHub repo to Railway
2. Railway will auto-detect Vite and build the project
3. The app will be live at your Railway URL

### Environment Variables

No environment variables required - the app runs entirely in the browser.

## Data Storage

- **Browser**: Data is auto-saved to localStorage
- **Export**: Download your budget as a `.json` file for backup
- **Import**: Load a previously exported `.json` file

## License

MIT

