import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Apartments from './pages/Apartments';
import Cars from './pages/Cars';
import Reservations from './pages/Reservations';
import Analytics from './pages/Analytics';
import SignIn from './pages/SignIn';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="apartments" element={<Apartments />} />
              <Route path="cars" element={<Cars />} />
              <Route path="reservations" element={<Reservations />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
