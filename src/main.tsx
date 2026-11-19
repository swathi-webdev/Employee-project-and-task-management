import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Global filter to suppress benign Chrome Extension message channel noise
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reasonMsg = event.reason?.message || (typeof event.reason === 'string' ? event.reason : '');
    if (
      typeof reasonMsg === 'string' &&
      (reasonMsg.includes('A listener indicated an asynchronous response') ||
       reasonMsg.includes('message channel closed') ||
       reasonMsg.includes('message port closed'))
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const errorMsg = event.message || '';
    if (
      typeof errorMsg === 'string' &&
      (errorMsg.includes('A listener indicated an asynchronous response') ||
       errorMsg.includes('message channel closed') ||
       errorMsg.includes('message port closed'))
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
