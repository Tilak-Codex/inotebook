import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const host = process.env.REACT_APP_BACKEND_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : 'https://inotebook-zdib.onrender.com');

const ForgotPassword = (props) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${host}/api/auth/forgotPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });
      const json = await response.json();
      if (response.ok) {
        props.showAlert("Password reset link sent successfully! Check your email inbox.", "success");
        setEmail("");
      } else {
        props.showAlert(json.error || "Something went wrong.", "danger");
      }
    } catch (err) {
      props.showAlert("Could not connect to authentication server.", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '75vh' }}>
      <div className="glass-card p-5" style={{ width: '100%', maxWidth: '450px' }}>
        <h2 className="text-center mb-4" style={{ fontWeight: 800, background: 'linear-gradient(135deg, #a5b4fc, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Recover Password</h2>
        <p className="text-center text-muted mb-4" style={{ fontSize: '0.9rem' }}>Enter your email address and we'll send you a secure link to reset your password.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="form-label" style={{ fontWeight: 500, color: '#94a3b8' }}>Email Address</label>
            <input 
              type="email" 
              className="form-control glass-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              id="email" 
              name="email" 
              placeholder="name@example.com" 
              required 
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="btn btn-premium w-100 mt-2 mb-4" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : "Send Reset Link"}
          </button>
        </form>
        
        <div className="text-center mt-3" style={{ fontSize: '0.85rem' }}>
          <Link to="/login" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
