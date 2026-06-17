import React, { useContext, useEffect, useRef, useState } from 'react';
import noteContext from '../context/notes/noteContext';
import NoteItem from './NoteItem';
import AddNote from './AddNote';
import { useNavigate } from 'react-router-dom';

const Notes = (props) => {
  const context = useContext(noteContext);
  const { notes, getNotes, editNote } = context;
  let navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getNotes();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  const ref = useRef(null);
  const refClose = useRef(null);
  const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "" });
  const [editing, setEditing] = useState(false);

  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({
      id: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (note.etitle.length < 3) {
      props.showAlert("Title must be at least 3 characters", "danger");
      return;
    }
    if (note.edescription.length < 5) {
      props.showAlert("Description must be at least 5 characters", "danger");
      return;
    }
    setEditing(true);
    const result = await editNote(note.id, note.etitle, note.edescription, note.etag);
    setEditing(false);
    if (result.success) {
      refClose.current.click();
      props.showAlert("Updated note successfully", "success");
    } else {
      props.showAlert(result.error || "Failed to update note", "danger");
    }
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <>
      <AddNote showAlert={props.showAlert} />

      <button 
        ref={ref} 
        type="button" 
        className="btn btn-primary d-none" 
        data-bs-toggle="modal" 
        data-bs-target="#editNoteModal"
      >
        Launch modal
      </button>

      <div className="modal fade glass-modal" id="editNoteModal" tabIndex="-1" aria-labelledby="editNoteModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editNoteModalLabel" style={{ fontWeight: 700 }}>Edit Note</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="etitle" className="form-label" style={{ color: '#94a3b8' }}>Title</label>
                  <input 
                    type="text" 
                    className="form-control glass-input" 
                    id="etitle" 
                    name="etitle" 
                    value={note.etitle} 
                    onChange={onChange} 
                    required 
                    minLength={3}
                    disabled={editing}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="edescription" className="form-label" style={{ color: '#94a3b8' }}>Description</label>
                  <textarea 
                    className="form-control glass-input" 
                    id="edescription" 
                    name="edescription" 
                    rows="4" 
                    value={note.edescription} 
                    onChange={onChange} 
                    required 
                    minLength={5}
                    disabled={editing}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="etag" className="form-label" style={{ color: '#94a3b8' }}>Tag</label>
                  <input 
                    type="text" 
                    className="form-control glass-input" 
                    id="etag" 
                    name="etag" 
                    value={note.etag} 
                    onChange={onChange}
                    disabled={editing}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button ref={refClose} type="button" className="btn btn-premium-secondary btn-sm" data-bs-dismiss="modal" disabled={editing}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-premium btn-sm" disabled={editing}>
                  {editing ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="row my-3">
        <h3 className="mb-4" style={{ fontWeight: 700, background: 'linear-gradient(135deg, #a5b4fc, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Your Notes
        </h3>
        
        <div className="container">
          {notes.length === 0 && (
            <div className="glass-card p-5 text-center text-muted">
              <svg className="mb-3" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="9" y1="15" x2="15" y2="15"></line>
                <line x1="9" y1="11" x2="15" y2="11"></line>
              </svg>
              <h5>No notes to display</h5>
              <p className="small mb-0">Create your first note above to get started!</p>
            </div>
          )}
        </div>
        
        {notes.map((noteItem) => {
          return <NoteItem key={noteItem._id} updateNote={updateNote} note={noteItem} showAlert={props.showAlert} />;
        })}
      </div>
    </>
  );
};

export default Notes;
