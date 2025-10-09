import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'

// bootstrappie
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './assets/scss/main.scss'

// boostrap icons
import "bootstrap-icons/font/bootstrap-icons.css";

// react-toastify styles
import 'react-toastify/dist/ReactToastify.css';

// custom style classes
import './assets/css/main.css'

// import contexts for authentiaction and theme
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)