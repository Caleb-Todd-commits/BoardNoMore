import { useState } from 'react';
import './Auth.css';

function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);

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
                  : 'Welcome back to game night'}
              </p>
            </div>

            <form className="auth-form">
              {isSignUp && (
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter your name"
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
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
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
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="bio">Bio (Optional)</label>
                    <textarea
                      id="bio"
                      placeholder="Tell us about your board game interests..."
                      rows="3"
                    />
                  </div>
                </>
              )}

              <button type="submit" className="auth-submit">
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <div className="oauth-buttons">
              <button className="oauth-button google">
                <span>🔍</span>
                Continue with Google
              </button>
              <button className="oauth-button apple">
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
                  <p>Discover sessions for your favorite board games nearby</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">👥</span>
                <div>
                  <h3>Meet Players</h3>
                  <p>Connect with local gamers who share your interests</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📅</span>
                <div>
                  <h3>Easy Scheduling</h3>
                  <p>Organize game nights that fit everyone's schedule</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⭐</span>
                <div>
                  <h3>Build Community</h3>
                  <p>Rate sessions and build your gaming reputation</p>
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
