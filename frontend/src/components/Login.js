import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const host = process.env.REACT_APP_BACKEND_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : 'https://inotebook-zdib.onrender.com');

const Login = (props) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${host}/api/auth/loginUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: credentials.email, password: credentials.password })
      });
      const json = await response.json();
      if (response.ok && json.token) {
        localStorage.setItem('token', json.token);
        props.showAlert("Logged in successfully", "success");
        navigate("/");
      } else {
        props.showAlert(json.error || "Invalid login credentials", "danger");
      }
    } catch (err) {
      props.showAlert("Could not connect to authentication server", "danger");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '75vh' }}>
      <div className="glass-card p-5" style={{ width: '100%', maxWidth: '450px' }}>
        <h2 className="text-center mb-4" style={{ fontWeight: 800, background: 'linear-gradient(135deg, #a5b4fc, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Welcome Back</h2>
        <p className="text-center text-muted mb-4" style={{ fontSize: '0.9rem' }}>Securely access your cloud-based notebook</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="form-label" style={{ fontWeight: 500, color: '#94a3b8' }}>Email Address</label>
            <input 
              type="email" 
              className="form-control glass-input" 
              value={credentials.email} 
              onChange={onChange} 
              id="email" 
              name="email" 
              placeholder="name@example.com" 
              required 
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label htmlFor="password" className="form-label mb-0" style={{ fontWeight: 500, color: '#94a3b8' }}>Password</label>
              <Link to="/forgot-password" style={{ color: '#818cf8', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>Forgot Password?</Link>
            </div>
            <input 
              type="password" 
              className="form-control glass-input" 
              value={credentials.password} 
              onChange={onChange} 
              id="password" 
              name="password" 
              placeholder="••••••••" 
              required 
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="btn btn-premium w-100 mt-2 mb-4" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : "Sign In"}
          </button>
        </form>
        
        <div className="text-center mt-2" style={{ fontSize: '0.85rem' }}>
          <span className="text-muted">Don't have an account? </span>
          <Link to="/signup" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
