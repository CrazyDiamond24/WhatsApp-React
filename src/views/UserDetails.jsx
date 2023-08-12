// import { Component, useEffect, useState } from 'react'
// import { userService } from '../services/user.service'
// import { Link, useNavigate, useParams } from 'react-router-dom'
// import { ChatWindow } from './ChatWindow'

// export function UserDetails(props) {
//   console.log('entity details')
//   const [user, setUser] = useState(null)
//   const params = useParams()
//   const navigate = useNavigate()

//   useEffect(() => {
//     loadUser()
//   }, [params.id])

//   async function loadUser() {
//     try {
//       const user = await userService.getById(params.id)
//       setUser(user)
//     } catch (error) {
//       console.log('error:', error)
//     }
//   }

//   function onBack() {
//     navigate('/')
//   }

//   console.log('render')

//   if (!user) return <div>Loading...</div>
//   return (
//     <section className='user-details'>
//       <section>
//         <h3>Lorem ipsum dolor</h3>
//       </section>

//       <img src={`https://robohash.org/${user._id}`} />

//       <button onClick={onBack}>Back</button>
//     </section>
//   )
// }
