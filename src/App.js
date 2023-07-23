import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import './assets/scss/global.scss'
import { UserIndex } from './views/UserIndex'
import { About } from './views/About'
import { UserDetails } from './views/UserDetails'
import { AddContact } from './views/AddContact'
import { LoginSignup } from './views/LoginSignup'
import { useDispatch } from 'react-redux'
import { getUser } from './store/actions/user.actions'
import { useEffect } from 'react'
function App() {
  const dispatch = useDispatch()
  return (
    <Router>
      <section className="main-app">
        <main className="container">
          <Routes>
            <Route path="/" element={<UserIndex />} />
            <Route path="/user/edit/:id?" element={<AddContact />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<LoginSignup />} />
          </Routes>
        </main>
      </section>
    </Router>
  )
}

export default App
