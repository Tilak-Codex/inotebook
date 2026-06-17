import React, { useContext, useState } from 'react';
import noteContext from '../context/notes/noteContext';

const NoteItem = (props) => {
  const context = useContext(noteContext);
  const { deleteNote } = context;
  const { note, updateNote, showAlert } = props;
  const [deleting, setDeleting] = useState(false);

  const getTagClass = (tag) => {
    if (!tag) return 'tag-general';
    switch (tag.toLowerCase()) {
      case 'work': return 'tag-work';
      case 'personal': return 'tag-personal';
      case 'urgent': return 'tag-urgent';
      case 'study': return 'tag-study';
      default: return 'tag-general';
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    const result = await deleteNote(note._id);
    setDeleting(false);
    if (result.success) {
      showAlert("Note deleted successfully", "success");
    } else {
      showAlert(result.error || "Failed to delete note", "danger");
    }
  };

  // Format date nicely
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="col-md-4 mb-4">
      <div className="glass-card h-100 p-4 d-flex flex-column justify-content-between" style={{ opacity: deleting ? 0.6 : 1 }}>
        <div>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <span className={`tag-badge ${getTagClass(note.tag)}`}>
              {note.tag || "General"}
            </span>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
              {formatDate(note.date)}
            </span>
          </div>
          
          <h4 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '10px', wordBreak: 'break-word' }}>
            {note.title}
          </h4>
          
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {note.description}
          </p>
        </div>

        <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          {/* Edit Icon */}
          <button 
            className="btn btn-sm p-1 border-0" 
            style={{ color: '#818cf8', background: 'transparent' }}
            onClick={() => updateNote(note)}
            title="Edit Note"
            disabled={deleting}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </button>
          
          {/* Delete Icon */}
          <button 
            className="btn btn-sm p-1 border-0" 
            style={{ color: '#f43f5e', background: 'transparent' }}
            onClick={handleDelete}
            title="Delete Note"
            disabled={deleting}
          >
            {deleting ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ width: '14px', height: '14px' }}></span>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
