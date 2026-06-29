import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import HomePage from './pages/HomePage.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <HomePage />
    </ThemeProvider>
  </StrictMode>,
)
