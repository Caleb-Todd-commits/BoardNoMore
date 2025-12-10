import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navigation from './components/Navigation';
import SupabaseTest from './components/SupabaseTest';
import Discover from './pages/Discover';
import Auth from './pages/Auth';
import SessionDetail from './pages/SessionDetail';
import Games from './pages/Games';
import CreateSession from './pages/CreateSession';
import Profile from './pages/Profile';
import MySessions from './pages/MySessions';
import './App.css';

function App() {
  // For demo purposes, you can toggle this to see authenticated vs non-authenticated views
  const [isAuthenticated] = useState(true);

  return (
    <Router>
      <div className="app">
        <Navigation isAuthenticated={isAuthenticated} />
        <Routes>
          <Route path="/" element={<Discover />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/games" element={<Games />} />
          <Route path="/session/:id" element={<SessionDetail />} />
          <Route path="/create" element={<CreateSession />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-sessions" element={<MySessions />} />
        </Routes>
        <SupabaseTest />
      </div>
    </Router>
  );
}

export default App;