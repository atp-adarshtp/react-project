import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoutes from './utils/PrivateRoutes';
import { AuthProvider } from './utils/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/home/Home';
import DNS from './pages/dns/Dashboard';
import Server from './pages/home/Server.jsx';
import Profile from './pages/home/Profile';
import Login from './pages/login/Login';
import Register from './pages/login/Register';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-content">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<PrivateRoutes />}>
                <Route path="/dns" element={<DNS />} />
                <Route path="/server" element={<Server />} />
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
