import React from 'react';

const About = () => {
  return (
    <div className="container py-4">
      {/* Hero Header */}
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3" style={{ fontWeight: 800, background: 'linear-gradient(135deg, #a5b4fc, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          About iNoteBook
        </h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: '650px', fontSize: '1.15rem' }}>
          iNoteBook is a state-of-the-art MERN stack web application designed to help you secure and organize your thoughts, ideas, and tasks in the cloud.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="glass-card h-100 p-4">
            <div className="d-flex align-items-center mb-3">
              <span className="badge tag-badge tag-urgent me-2 p-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <h4 className="mb-0" style={{ fontWeight: 700 }}>Secure Storage</h4>
            </div>
            <p className="text-muted" style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>
              Your data is completely private. Every user account is authenticated using robust JSON Web Tokens (JWT) and passwords are encrypted with bcrypt, ensuring that only you can access your notes.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="glass-card h-100 p-4">
            <div className="d-flex align-items-center mb-3">
              <span className="badge tag-badge tag-work me-2 p-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
              </span>
              <h4 className="mb-0" style={{ fontWeight: 700 }}>Tag Organization</h4>
            </div>
            <p className="text-muted" style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>
              Stay organized by applying categories or tags to your notes. Use standard presets like Work, Personal, Study, or create your own custom tags to filter and find notes in seconds.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="glass-card h-100 p-4">
            <div className="d-flex align-items-center mb-3">
              <span className="badge tag-badge tag-personal me-2 p-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </span>
              <h4 className="mb-0" style={{ fontWeight: 700 }}>Export to PDF</h4>
            </div>
            <p className="text-muted" style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>
              Need a physical copy or want to share notes? One-click PDF generation automatically bundles your title, tag, creation date, and body copy into a formatted document for print or offline viewing.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack Details */}
      <div className="glass-card p-5 mb-4">
        <h3 className="mb-4 text-center" style={{ fontWeight: 700, background: 'linear-gradient(135deg, #a5b4fc, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Powered by the MERN Stack
        </h3>
        <p className="text-center text-muted mb-5 mx-auto" style={{ maxWidth: '600px', fontSize: '0.95rem' }}>
          iNoteBook is engineered on modern web frameworks to ensure rapid load times, smooth transitions, and reliable server response rates.
        </p>

        <div className="row g-4 text-center">
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded-3 border-secondary-subtle">
              <h5 className="mb-1" style={{ fontWeight: 700, color: '#10b981' }}>MongoDB</h5>
              <span className="text-muted small">NoSQL Database</span>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded-3 border-secondary-subtle">
              <h5 className="mb-1" style={{ fontWeight: 700, color: '#f59e0b' }}>Express.js</h5>
              <span className="text-muted small">Node Framework</span>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded-3 border-secondary-subtle">
              <h5 className="mb-1" style={{ fontWeight: 700, color: '#06b6d4' }}>React.js</h5>
              <span className="text-muted small">Frontend Library</span>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded-3 border-secondary-subtle">
              <h5 className="mb-1" style={{ fontWeight: 700, color: '#6366f1' }}>Node.js</h5>
              <span className="text-muted small">JS Runtime Environment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
