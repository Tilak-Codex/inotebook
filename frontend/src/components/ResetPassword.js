import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const host = process.env.REACT_APP_BACKEND_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : 'https://inotebook-zdib.onrender.com');

const ResetPassword = (props) => {
  const [credentials, setCredentials] = useState({ password: "", cpassword: "" });
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (credentials.password !== credentials.cpassword) {
      props.showAlert("Passwords do not match.", "danger");
      return;
    }

    // Password validation match backend rules
    const password = credentials.password;
    if (password.length < 5) {
      props.showAlert("Password must be at least 5 characters.", "danger");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      props.showAlert("Password must contain at least one uppercase letter.", "danger");
      return;
    }
    if (!/[a-z]/.test(password)) {
      props.showAlert("Password must contain at least one lowercase letter.", "danger");
      return;
    }
    if (!/[0-9]/.test(password)) {
      props.showAlert("Password must contain at least one number.", "danger");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${host}/api/auth/resetPassword/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password: credentials.password })
      });
      const json = await response.json();
      if (response.ok) {
        props.showAlert("Password reset successfully! You can now log in.", "success");
        navigate("/login");
      } else {
        props.showAlert(json.error || "Reset failed. The link may have expired.", "danger");
      }
    } catch (err) {
      props.showAlert("Could not connect to authentication server.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="glass-card p-5" style={{ width: '100%', maxWidth: '450px' }}>
        <h2 className="text-center mb-4" style={{ fontWeight: 800, background: 'linear-gradient(135deg, #a5b4fc, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Reset Password</h2>
        <p className="text-center text-muted mb-4" style={{ fontSize: '0.9rem' }}>Please enter and confirm your new secure password.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="password" className="form-label" style={{ fontWeight: 500, color: '#94a3b8' }}>New Password</label>
            <input 
              type="password" 
              className="form-control glass-input" 
              value={credentials.password} 
              onChange={onChange} 
              id="password" 
              name="password" 
              placeholder="Min. 5 characters" 
              required 
              minLength={5}
              disabled={loading}
            />
            <div className="form-text text-muted" style={{ fontSize: '0.75rem', marginTop: '5px' }}>
              Must contain an uppercase letter, lowercase letter, and a number.
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="cpassword" className="form-label" style={{ fontWeight: 500, color: '#94a3b8' }}>Confirm New Password</label>
            <input 
              type="password" 
              className="form-control glass-input" 
              value={credentials.cpassword} 
              onChange={onChange} 
              id="cpassword" 
              name="cpassword" 
              placeholder="Confirm new password" 
              required 
              minLength={5}
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="btn btn-premium w-100 mt-2 mb-4" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : "Update Password"}
          </button>
        </form>
        
        <div className="text-center mt-3" style={{ fontSize: '0.85rem' }}>
          <Link to="/login" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
