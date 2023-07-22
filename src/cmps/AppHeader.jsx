import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

export function AppHeader(props) {
  const navigate = useNavigate()

  const user = useSelector((storeState) => storeState.userModule.loggedInUser)

  console.log('loggedinuser', user)

  function onBack() {
    navigate(-1)
  }

  return (
    <header className="app-header">
      <section className="user-header">
        <img src={user?.img} alt={user?.username} />
        <p>Welcome, {user?.fullName}!</p>
        <Link to="/login">Login</Link>
      </section>
    </header>
  )
}
