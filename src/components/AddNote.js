import React, { useContext, useState } from 'react';
import noteContext from '../context/notes/noteContext';

const AddNote = (props) => {
  const context = useContext(noteContext);
  const { addNote } = context;

  const [note, setNote] = useState({ title: "", description: "", tag: "General" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (note.title.length < 3) {
      props.showAlert("Title must be at least 3 characters", "danger");
      return;
    }
    if (note.description.length < 5) {
      props.showAlert("Description must be at least 5 characters", "danger");
      return;
    }
    setSubmitting(true);
    const result = await addNote(note.title, note.description, note.tag);
    setSubmitting(false);
    if (result.success) {
      props.showAlert("Note added successfully", "success");
      setNote({ title: "", description: "", tag: "General" });
    } else {
      props.showAlert(result.error || "Failed to add note", "danger");
    }
  }

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  }

  const handleTagPreset = (preset) => {
    setNote({ ...note, tag: preset });
  }

  return (
    <div className="glass-card p-4 mb-5">
      <h3 className="mb-4" style={{ fontWeight: 700, background: 'linear-gradient(135deg, #a5b4fc, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Create a Note
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label" style={{ color: '#94a3b8', fontWeight: 500 }}>Title</label>
          <input 
            type="text" 
            className="form-control glass-input" 
            id="title" 
            name="title" 
            placeholder="Reviewing project architectures..." 
            value={note.title} 
            onChange={onChange} 
            required 
            minLength={3}
            disabled={submitting}
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="description" className="form-label" style={{ color: '#94a3b8', fontWeight: 500 }}>Description</label>
          <textarea 
            className="form-control glass-input" 
            id="description" 
            name="description" 
            rows="3" 
            placeholder="Add detailed information here..." 
            value={note.description} 
            onChange={onChange} 
            required 
            minLength={5}
            disabled={submitting}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="tag" className="form-label" style={{ color: '#94a3b8', fontWeight: 500 }}>Tag</label>
          <div className="d-flex gap-2 mb-2">
            <input 
              type="text" 
              className="form-control glass-input" 
              id="tag" 
              name="tag" 
              value={note.tag} 
              onChange={onChange}
              placeholder="General"
              disabled={submitting}
            />
          </div>
          <div className="d-flex gap-2 flex-wrap">
            {['General', 'Work', 'Personal', 'Urgent', 'Study'].map((pTag) => (
              <button 
                type="button" 
                key={pTag} 
                onClick={() => handleTagPreset(pTag)}
                className={`badge tag-badge border-0 ${
                  note.tag.toLowerCase() === pTag.toLowerCase()
                    ? 'bg-primary text-white' 
                    : 'tag-general'
                }`}
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                disabled={submitting}
              >
                {pTag}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-premium w-100" disabled={submitting}>
          {submitting ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : "Add Note"}
        </button>
      </form>
    </div>
  )
}

export default AddNote;
