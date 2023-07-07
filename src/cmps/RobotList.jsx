import { memo } from 'react'
import { RobotPreview } from './RobotPreview'
function _RobotList({ robots, onRemoveRobot }) {
  console.log('ROBOT LIST RENDERED')
  return (
    <section className='robot-list simple-cards-grid'>
      {robots.map((robot) => (
        <RobotPreview
          key={robot._id}
          robot={robot}
          onRemoveRobot={onRemoveRobot}
        />
      ))}
    </section>
  )
}

//comparing the current props with the previous props, and only re-rendering the component if the props have changed.
export const RobotList = memo(_RobotList)
