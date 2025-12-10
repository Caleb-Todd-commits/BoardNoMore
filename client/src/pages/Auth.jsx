import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, signIn, signInWithGoogle, signInWithApple } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already logged in
  if (user) {
    navigate('/');
    return null;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(
          formData.email,
          formData.password,
          formData.name,
          formData.location,
          formData.bio
        );
        alert('Check your email to confirm your account!');
      } else {
        await signIn(formData.email, formData.password);
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAppleSignIn = async () => {
    setError(null);
    try {
      await signInWithApple();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <span className="auth-icon">🎲</span>
              <h1>BoardNoMore</h1>
              <p className="auth-tagline">
                {isSignUp
                  ? 'Join the board game community'
                  : 'Welcome back to BoardNoMore'}
              </p>
            </div>

            {error && (
              <div className="error-message" style={{
                padding: '12px',
                marginBottom: '16px',
                backgroundColor: '#fee',
                color: '#c33',
                borderRadius: '8px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              {isSignUp && (
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {isSignUp && (
                <>
                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      placeholder="City, State"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="bio">Bio (Optional)</label>
                    <textarea
                      id="bio"
                      placeholder="Tell us about your board game interests..."
                      rows="3"
                      value={formData.bio}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
              </button>
            </form>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <div className="oauth-buttons">
              <button className="oauth-button google" onClick={handleGoogleSignIn} disabled={loading}>
                <span>🔍</span>
                Continue with Google
              </button>
              <button className="oauth-button apple" onClick={handleAppleSignIn} disabled={loading}>
                <span>🍎</span>
                Continue with Apple
              </button>
            </div>

            <div className="auth-footer">
              {isSignUp ? (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="auth-toggle"
                    onClick={() => setIsSignUp(false)}
                  >
                    Sign In
                  </button>
                </p>
              ) : (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="auth-toggle"
                    onClick={() => setIsSignUp(true)}
                  >
                    Sign Up
                  </button>
                </p>
              )}
            </div>
          </div>

          <div className="auth-features">
            <h2>Why Join BoardNoMore?</h2>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <div>
                  <h3>Find Your Game</h3>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">👥</span>
                <div>
                  <h3>Meet Players</h3>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📅</span>
                <div>
                  <h3>Easy Scheduling</h3>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⭐</span>
                <div>
                  <h3>Build Community</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
