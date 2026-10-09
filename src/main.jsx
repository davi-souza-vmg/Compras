import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes'
import './index.css'
createRoot(document.getElementById('root')).render(
  <HashRouter><AuthProvider><AppRoutes /></AuthProvider></HashRouter>)
