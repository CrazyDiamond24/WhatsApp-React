import React from 'react'

export function RobotPreview({ robot, onRemoveRobot, onSelectContact }) {

  const handleClick = () => {
    onSelectContact();
  };

  return (
    <article className='contact-preview' onClick={handleClick}>
      <img
        className='contact-preview-image'
        src={robot.img}
        alt={robot.fullName}
      />
      <h2>{robot.fullName}</h2>
    </article>
  )
}

/* <section className='actions'>
<button onClick={() => onRemoveRobot(robot._id)}>X</button>
<Link to={`/robot/edit/${robot._id}`}>Edit</Link>
</section> */
