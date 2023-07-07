import React from 'react'
import { Link } from 'react-router-dom'

export function RobotPreview({ robot, onRemoveRobot }) {
  const robotImgUrl = `https://robohash.org/${robot._id}`;
  
  return (
    <article className='contact-preview'>
      <img className='contact-preview-image' src={robotImgUrl} alt={robot.model} />
      <Link to={`/chat/${robot._id}`} className='info'>
        <h2>{robot.model}</h2>
      </Link>
      {/* <section className='actions'>
        <button onClick={() => onRemoveRobot(robot._id)}>X</button>
        <Link to={`/robot/edit/${robot._id}`}>Edit</Link>
      </section> */}
    </article>
  )
}

