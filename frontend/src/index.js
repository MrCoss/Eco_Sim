import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Root entry point for the EcoSim App.
// This file is responsible for:
// 1. Importing the main App component and global styles.
// 2. Wrapping the App in React's StrictMode for development checks.
// 3. Rendering the entire application into the 'root' div in index.html.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
