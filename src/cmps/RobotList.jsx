import { memo } from 'react'
import { RobotPreview } from './RobotPreview'
function _RobotList({ robots, onRemoveRobot, onSelectContact }) {
  console.log('ROBOT LIST RENDERED')
  return (
    <section className='robot-list simple-cards-grid'>
      {robots.map((robot) => (
        <RobotPreview
          key={robot._id}
          robot={robot}
          onRemoveRobot={onRemoveRobot}
          onSelectContact={() => onSelectContact(robot._id)}
        />
      ))}
    </section>
  )
}

export const RobotList = memo(_RobotList)