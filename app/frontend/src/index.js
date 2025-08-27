import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Root entry point for EcoSim App
// - Wraps App with StrictMode (helps catch errors in development)
// - Attaches App to the #root div in index.html
// - Adds a fallback theme class to body (can be overridden by App)

const rootElement = document.getElementById('root');

// Ensure body has a default theme before React loads
if (rootElement && !document.body.className) {
  document.body.classList.add("theme-spring"); // 🌸 Default seasonal theme
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
