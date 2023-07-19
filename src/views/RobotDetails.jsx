// import { Component, useEffect, useState } from 'react'
// import { robotService } from '../services/robot.service'
// import { Link, useNavigate, useParams } from 'react-router-dom'
// import { ChatWindow } from './ChatWindow'

// export function RobotDetails(props) {
//   console.log('entity details')
//   const [robot, setRobot] = useState(null)
//   const params = useParams()
//   const navigate = useNavigate()

//   useEffect(() => {
//     loadRobot()
//   }, [params.id])

//   async function loadRobot() {
//     try {
//       const robot = await robotService.getById(params.id)
//       setRobot(robot)
//     } catch (error) {
//       console.log('error:', error)
//     }
//   }

//   function onBack() {
//     navigate('/')
//   }

//   console.log('render')

//   if (!robot) return <div>Loading...</div>
//   return (
//     <section className='robot-details'>
//       <section>
//         <h3>Lorem ipsum dolor</h3>
//       </section>

//       <img src={`https://robohash.org/${robot._id}`} />

//       <button onClick={onBack}>Back</button>
//     </section>
//   )
// }
