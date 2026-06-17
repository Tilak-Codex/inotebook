import React, {useContext} from 'react'
import noteContext from '../context/notes/noteContext';

const About = () => {
  const context = useContext(noteContext);
  return (
    <div>
        This is about {context.name}, a {context.grade} student.
    </div>
  )
}

export default About
