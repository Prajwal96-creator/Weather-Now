import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'primereact/resources/themes/lara-light-blue/theme.css'; // or any PrimeReact theme
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';              // grid & flex utilities
import 'leaflet/dist/leaflet.css';   
import { BrowserRouter as Router } from 'react-router-dom';    
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
    <App />
    </Router>
  </StrictMode>,
)
