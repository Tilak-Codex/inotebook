import React, { useState } from 'react';
import noteContext from './noteContext';
const host = "https://inotebook-zdib.onrender.com";
const NoteState = (props) => {
  const host = "https://inotebook-zdib.onrender.com";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  // Fetch all notes
  const getNotes = async () => {
    try {
      const response = await fetch(`${host}/api/notes/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')
        }
      });
      if (response.ok) {
        const json = await response.json();
        setNotes(json);
      }
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    }
  }

  // Add a Note
  const addNote = async (title, description, tag) => {
    try {
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')
        },
        body: JSON.stringify({ title, description, tag })
      });
      if (response.ok) {
        const note = await response.json();
        setNotes(notes.concat(note));
        return { success: true };
      } else {
        const errJson = await response.json();
        return { success: false, error: errJson.error || "Failed to add note" };
      }
    } catch (err) {
      console.error("Failed to add note:", err);
      return { success: false, error: "Could not connect to server" };
    }
  }

  // Delete a Note
  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')
        }
      });
      if (response.ok) {
        const newNotes = notes.filter((note) => { return note._id !== id });
        setNotes(newNotes);
        return { success: true };
      } else {
        return { success: false, error: "Failed to delete note" };
      }
    } catch (err) {
      console.error("Failed to delete note:", err);
      return { success: false, error: "Could not connect to server" };
    }
  }

  // Edit a Note
  const editNote = async (id, title, description, tag) => {
    try {
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')
        },
        body: JSON.stringify({ title, description, tag })
      });
      if (response.ok) {
        let newNotes = JSON.parse(JSON.stringify(notes));
        for (let index = 0; index < newNotes.length; index++) {
          const element = newNotes[index];
          if (element._id === id) {
            newNotes[index].title = title;
            newNotes[index].description = description;
            newNotes[index].tag = tag;
            break;
          }
        }
        setNotes(newNotes);
        return { success: true };
      } else {
        return { success: false, error: "Failed to update note" };
      }
    } catch (err) {
      console.error("Failed to edit note:", err);
      return { success: false, error: "Could not connect to server" };
    }
  }

  return (
    <noteContext.Provider value={{ notes, getNotes, addNote, deleteNote, editNote }}>
      {props.children}
    </noteContext.Provider>
  )
}

export default NoteState;