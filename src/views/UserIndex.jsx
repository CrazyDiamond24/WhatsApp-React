import { Component, useCallback, useEffect, useMemo, useState } from 'react'
import { UserList } from '../cmps/UserList'
import { UserFilter } from '../cmps/UserFilter'
import { Link } from 'react-router-dom'
import { connect, useDispatch, useSelector } from 'react-redux'
import {
  loadUsers,
  removeUser,
  setFilterBy,
  setCurrUser,
} from '../store/actions/user.actions'
import { ChatWindow } from './ChatWindow'
import { AppHeader } from '../cmps/AppHeader'
import { UserProfile } from '../cmps/UserProfile'
import { ReactComponent as SearchIcon } from '../assets/imgs/searchIcon.svg'
import LogoWithoutWord from '../assets/imgs/Logo-without-word.png';

export function UserIndex(props) {
  const [filterBy, setFilterBy] = useState('')
  const [isShowProfile, setIsShowProfile] = useState(false)
  const [isInputOpen, setIsInputOpen] = useState(false)

  const user = useSelector((storeState) => {
    return storeState.userModule.selectedUser
  })

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadUsers())
  }, [user])

  const onRemoveUser = useCallback(async (userId) => {
    try {
      dispatch(removeUser(userId))
    } catch (error) {
      console.log('error:', error)
    }
  }, [])

  function handleShowProfile() {
    setIsShowProfile(true)
  }

  function handleCloseUserProfile() {
    setIsShowProfile(false)
  }

  function handleInput(e) {
    setFilterBy(e.target.value)
  }

  function handleOpenInput() {
    setIsInputOpen((prevIsInputOpen) => !prevIsInputOpen)
  }

  // if (!users) return <div>Loading...</div>

  return (
    <section className="home-page">
      {!isShowProfile ? (
        <section className="contact-list">
          <AppHeader showProfile={handleShowProfile} />
          <div className="svg-input-container">
            <span
              className="pointer search-svg"
              onClick={() => handleOpenInput()}
            >
              <SearchIcon className={`search-icon-svg ${isInputOpen ? 'icon-open' : 'icon-close'}`}/>
            </span>
              <input
                className={`search-input ${isInputOpen ? 'open' : 'close'}`}
                type="text"
                placeholder="Search contacts or conversations..."
                value={filterBy}
                onChange={(e) => handleInput(e)}
              />
            {/* <UserFilter filterBy={filterBy} onChangeFilter={onChangeFilter} /> */}
          </div>
          <div className="add-contact">
            {/* <Link to="/user/edit">Add contact</Link> */}
          </div>
          <UserList filterBy={filterBy} onRemoveUser={onRemoveUser} />
          <div className='accessory-list'>
          </div>
        </section>
      ) : (
        <UserProfile
          show={isShowProfile}
          closeUserProfile={handleCloseUserProfile}
        />
      )}
      <ChatWindow key={user?._id} />
    </section>
  )
}
