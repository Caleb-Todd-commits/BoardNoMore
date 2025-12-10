import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';
import Discover from './pages/Discover';
import Auth from './pages/Auth';
import SessionDetail from './pages/SessionDetail';
import Games from './pages/Games';
import CreateSession from './pages/CreateSession';
import Profile from './pages/Profile';
import MySessions from './pages/MySessions';
import './App.css';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/auth" />;
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app">
      <Navigation isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/" element={<Discover />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/games" element={<Games />} />
        <Route path="/session/:id" element={<SessionDetail />} />
        <Route path="/create" element={
          <ProtectedRoute>
            <CreateSession />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/my-sessions" element={
          <ProtectedRoute>
            <MySessions />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;