import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import './assets/scss/global.scss'
import { UserIndex } from './views/UserIndex'
import { AddContact } from './views/AddContact'
import { LoginSignup } from './views/LoginSignup'
import { useDispatch } from 'react-redux'
import { getUser , loadUsers} from './store/actions/user.actions'
import { useEffect } from 'react'
import { UserMsg } from './cmps/UserMsg'
function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getUser())
    dispatch(loadUsers())
  }, [])
  return (
    <Router>
      <section className="main-app">
        <UserMsg />
        <main className="container">
          <Routes>
            <Route path="/" element={<UserIndex />} />
            <Route path="/user/edit/:id?" element={<AddContact />} />
            <Route path="/login" element={<LoginSignup status={'login'} />} />
            <Route path="/signup" element={<LoginSignup status={'signup'} />} />
          </Routes>
        </main>
      </section>
    </Router>
  )
}

export default App
