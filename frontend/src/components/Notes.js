import React, { useContext, useEffect, useRef, useState, useMemo } from 'react';
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
  const [selectedTag, setSelectedTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Extract all distinct tags present in user's notes
  const availableTags = useMemo(() => {
    const tagSet = new Set();
    notes.forEach((n) => {
      const t = n.tag && n.tag.trim() ? n.tag.trim() : "General";
      tagSet.add(t);
    });
    return ["All", ...Array.from(tagSet)];
  }, [notes]);

  // Filter notes based on selected tag and search query
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const noteTag = n.tag && n.tag.trim() ? n.tag.trim().toLowerCase() : "general";
      const matchesTag = selectedTag === "All" || noteTag === selectedTag.toLowerCase();
      const matchesSearch = searchQuery === "" || 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        n.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        noteTag.includes(searchQuery.toLowerCase());
      return matchesTag && matchesSearch;
    });
  }, [notes, selectedTag, searchQuery]);

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
                    className="form-control glass-input mb-2" 
                    id="etag" 
                    name="etag" 
                    value={note.etag} 
                    onChange={onChange}
                    disabled={editing}
                    placeholder="Enter tag or pick from presets below"
                  />
                  <div className="d-flex gap-2 flex-wrap">
                    {['General', 'Work', 'Personal', 'Urgent', 'Study'].map((pTag) => (
                      <button 
                        type="button" 
                        key={pTag} 
                        onClick={() => setNote({ ...note, etag: pTag })}
                        className={`badge tag-badge border-0 ${
                          note.etag?.toLowerCase() === pTag.toLowerCase()
                            ? 'bg-primary text-white' 
                            : 'tag-general'
                        }`}
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                        disabled={editing}
                      >
                        {pTag}
                      </button>
                    ))}
                  </div>
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

      <div className="row my-4">
        {/* Header with Title and Search Bar */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-3">
          <div>
            <h3 className="mb-1" style={{ fontWeight: 700, background: 'linear-gradient(135deg, #a5b4fc, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Your Notes
            </h3>
            <span className="text-muted small">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'} total
              {selectedTag !== 'All' && ` • Filtered by tag "${selectedTag}"`}
              {searchQuery && ` • Search: "${searchQuery}"`}
            </span>
          </div>

          {notes.length > 0 && (
            <div className="input-group input-group-sm" style={{ maxWidth: '280px' }}>
              <span className="input-group-text glass-input border-end-0" style={{ background: 'rgba(15, 23, 42, 0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input 
                type="text" 
                className="form-control glass-input border-start-0" 
                placeholder="Search by title, text, tag..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="btn btn-sm btn-outline-secondary glass-input" 
                  type="button" 
                  onClick={() => setSearchQuery("")}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tag Filter Pills */}
        {notes.length > 0 && (
          <div className="col-12 mb-4">
            <div className="d-flex gap-2 flex-wrap align-items-center">
              <span className="text-muted small me-1 d-flex align-items-center">
                <svg className="me-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
                Filter by Tag:
              </span>
              {availableTags.map((tag) => {
                const count = tag === "All" 
                  ? notes.length 
                  : notes.filter(n => (n.tag?.trim().toLowerCase() || 'general') === tag.toLowerCase()).length;
                const isSelected = selectedTag.toLowerCase() === tag.toLowerCase();

                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`btn btn-sm rounded-pill px-3 py-1 ${
                      isSelected 
                        ? 'btn-premium' 
                        : 'btn-premium-secondary'
                    }`}
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: isSelected ? 600 : 500,
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 0 14px rgba(99, 102, 241, 0.45)' : 'none'
                    }}
                  >
                    {tag}
                    <span 
                      className="badge rounded-pill ms-2" 
                      style={{ 
                        background: isSelected ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                        fontSize: '0.72rem'
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}

              {(selectedTag !== "All" || searchQuery !== "") && (
                <button 
                  type="button" 
                  className="btn btn-sm text-muted ms-2 p-0 border-0" 
                  style={{ fontSize: '0.8rem', textDecoration: 'underline', background: 'transparent' }}
                  onClick={() => { setSelectedTag("All"); setSearchQuery(""); }}
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>
        )}

        {/* Empty state: No notes at all */}
        {notes.length === 0 && (
          <div className="col-12">
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
          </div>
        )}

        {/* Empty state: Notes exist, but none match current filter */}
        {notes.length > 0 && filteredNotes.length === 0 && (
          <div className="col-12">
            <div className="glass-card p-5 text-center text-muted">
              <svg className="mb-3" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
              <h5>No matching notes found</h5>
              <p className="small mb-3">
                No notes found matching {selectedTag !== "All" && <strong>tag "{selectedTag}"</strong>}
                {selectedTag !== "All" && searchQuery && " and "}
                {searchQuery && <strong>search query "{searchQuery}"</strong>}.
              </p>
              <button 
                type="button"
                className="btn btn-premium-secondary btn-sm"
                onClick={() => { setSelectedTag("All"); setSearchQuery(""); }}
              >
                Reset Filters & Show All
              </button>
            </div>
          </div>
        )}

        {/* Filtered Notes List */}
        {filteredNotes.map((noteItem) => {
          return <NoteItem key={noteItem._id} updateNote={updateNote} note={noteItem} showAlert={props.showAlert} />;
        })}
      </div>
    </>
  );
};

export default Notes;
