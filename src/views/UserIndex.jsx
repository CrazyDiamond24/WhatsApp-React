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


export function UserIndex(props) {
  const users = useSelector((storeState) => storeState.userModule.users)
  // const filterBy = useSelector((storeState) => storeState.userModule.filterBy)
  const [filterBy, setFilterBy] = useState('')
  const [isShowProfile, setIsShowProfile] = useState(false)
  const [isInputOpen, setIsInputOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const dispatch = useDispatch()

  const loggedInUser = useSelector((storeState) => {
    return storeState.userModule.loggedInUser
  })

  const user = useSelector((storeState) => {
    return storeState.userModule.selectedUser
  })

  useEffect(() => {
    dispatch(loadUsers())
  }, [])

  function handleShowProfile() {
    console.log('hi')
    setIsShowProfile(true)
  }

  function handleCloseUserProfile() {
    setIsShowProfile(false)
  }

  const onRemoveUser = useCallback(async (userId) => {
    try {
      dispatch(removeUser(userId))
    } catch (error) {
      console.log('error:', error)
    }
  }, [])


  const handleInput = (e) => {
    setFilterBy(e.target.value)
  }
  const handleOpenInput = () => {
    setIsInputOpen((prevIsInputOpen) => !prevIsInputOpen)
  }

  // if (!users) return <div>Loading...</div>

  return (
    <section className='home-page'>
      {!isShowProfile ? (
        <section className='contact-list'>
          <AppHeader showProfile={handleShowProfile} />
          <div className='svg-input-container'>
            <span
              className='pointer search-svg'
              onClick={() => handleOpenInput()}
            >
              🔎
            </span>
            {isInputOpen && (
              <input
                className={`search-input ${isInputOpen ? 'open' : 'close'}`}
                type='text'
                placeholder='Search'
                value={filterBy}
                onChange={(e) => handleInput(e)}
              />
            )}
            {/* <UserFilter filterBy={filterBy} onChangeFilter={onChangeFilter} /> */}
          </div>
          <div className='add-contact'>
            <Link to='/user/edit'>Add contact</Link>
          </div>
          <UserList
            filterBy={filterBy}
            onRemoveUser={onRemoveUser}
          />
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
