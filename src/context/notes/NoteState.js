import React, { useState } from 'react';
import noteContext from './noteContext';

const NoteState = (props) => {
    const s1 = {
        "name":"satyarth",
        "grade":"10th"
    }
    const [state, setNotes] = useState(s1);
    update = () => {
        
    }
    return(
        <noteContext.Provider value={state}>    
            {props.children}
        </noteContext.Provider>
    )

}

export default NoteState;