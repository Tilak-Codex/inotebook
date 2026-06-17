import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = (props) => {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, cpassword } = credentials;
    if (password !== cpassword) {
      props.showAlert("Passwords do not match", "danger");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${host}/api/auth/createUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });
      const json = await response.json();
      if (response.ok && json.token) {
        localStorage.setItem('token', json.token);
        props.showAlert("Account created successfully", "success");
        navigate("/");
      } else {
        const errMsg = json.error || (json.errors && json.errors[0].msg) || "Failed to create account";
        props.showAlert(errMsg, "danger");
      }
    } catch (err) {
      props.showAlert("Could not connect to authentication server", "danger");
    } finally {
      setLoading(false);
    }
  }

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="glass-card p-5 my-4" style={{ width: '100%', maxWidth: '480px' }}>
        <h2 className="text-center mb-4" style={{ fontWeight: 800, background: 'linear-gradient(135deg, #a5b4fc, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Create Account</h2>
        <p className="text-center text-muted mb-4" style={{ fontSize: '0.9rem' }}>Join iNotebook and secure your thoughts</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label" style={{ fontWeight: 500, color: '#94a3b8' }}>Full Name</label>
            <input 
              type="text" 
              className="form-control glass-input" 
              value={credentials.name} 
              onChange={onChange} 
              id="name" 
              name="name" 
              placeholder="John Doe" 
              required 
              minLength={3}
              disabled={loading}
            />
          </div>
          <div className="mb-3">
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
          <div className="mb-3">
            <label htmlFor="password" className="form-label" style={{ fontWeight: 500, color: '#94a3b8' }}>Password</label>
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
          </div>
          <div className="mb-4">
            <label htmlFor="cpassword" className="form-label" style={{ fontWeight: 500, color: '#94a3b8' }}>Confirm Password</label>
            <input 
              type="password" 
              className="form-control glass-input" 
              value={credentials.cpassword} 
              onChange={onChange} 
              id="cpassword" 
              name="cpassword" 
              placeholder="Confirm your password" 
              required 
              minLength={5}
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="btn btn-premium w-100 mt-2 mb-4" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : "Get Started"}
          </button>
        </form>
        
        <div className="text-center mt-2" style={{ fontSize: '0.85rem' }}>
          <span className="text-muted">Already have an account? </span>
          <Link to="/login" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </div>
      </div>
    </div>
  )
}

export default Signup;
