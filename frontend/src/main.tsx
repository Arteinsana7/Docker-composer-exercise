import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'  // ← Ajoute cet import

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>  {/* Wrap App authProvider keeps token on localstorage an connect the app to allow user to visualise all pages when connected */}
      <App />
      {/* toast, alerts confirmation to actions */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a2e',
            color: '#ffffff',
            border: '1px solid #8b5cf6',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'inherit',
          },
          success: {
            style: {
              background: '#1a1a2e',
              color: '#beff05',
              border: '2px solid #beff05',
              boxShadow: '0 0 15px rgba(190, 255, 5, 0.2)',
            },
            iconTheme: {
              primary: '#beff05',
              secondary: '#1a1a2e',
            },
          },
          error: {
            style: {
              background: '#1a1a2e',
              color: '#ff0055',
              border: '2px solid #ff0055',
              boxShadow: '0 0 15px rgba(255, 0, 85, 0.2)',
            },
            iconTheme: {
              primary: '#ff0055',
              secondary: '#1a1a2e',
            },
          },
        }}
      />
    </AuthProvider>
  </StrictMode>,
)
