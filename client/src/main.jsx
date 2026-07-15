import React from 'react';
import ReactDOM from 'react-dom/client';
import { GeneralProvider } from './context/GeneralContext';
import App from './App';
import './main.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GeneralProvider>
      <App />
    </GeneralProvider>
  </React.StrictMode>,
);
