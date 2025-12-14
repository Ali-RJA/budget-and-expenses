import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { BudgetProvider } from './context/BudgetContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <BudgetProvider>
        <App />
      </BudgetProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
