import { Component, useCallback, useEffect, useMemo, useState } from "react"
import { UserList } from "../cmps/UserList"
import { UserFilter } from "../cmps/UserFilter"
import { Link } from "react-router-dom"
import { connect, useDispatch, useSelector } from "react-redux"
import {
  loadUsers,
  removeUser,
  setFilterBy,
} from "../store/actions/user.actions"
import { ChatWindow } from "./ChatWindow"
import { AppHeader } from "../cmps/AppHeader"

export function UserIndex(props) {
  const users = useSelector((storeState) => storeState.userModule.users)
  // const filterBy = useSelector((storeState) => storeState.userModule.filterBy)
  const [filterBy, setFilterBy] = useState("")
  const [isInputOpen, setIsInputOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const dispatch = useDispatch()
  const user = useSelector((storeState) => {
    return storeState.userModule.selectedUser
  })

  useEffect(() => {
    dispatch(loadUsers())
  }, [])

  const onRemoveUser = useCallback(async (userId) => {
    try {
      dispatch(removeUser(userId))
    } catch (error) {
      console.log("error:", error)
    }
  }, [])

  // const onChangeFilter = (filterBy) => {
  //   // dispatch(setFilterBy(filterBy))
  //   dispatch(loadUsers())
  // }

  const handleUserClick = (userId) => {
    setSelectedUserId(userId)
  }

  const handleInput = (e) => {
    setFilterBy(e.target.value)
  }
  const handleOpenInput = () => {
    setIsInputOpen((prevIsInputOpen) => !prevIsInputOpen)
  }

  // if (!users) return <div>Loading...</div>

  return (
    <section className="home-page">
      <section className="contact-list">
        <AppHeader />
        <div className="svg-input-container">
          <span
            className="pointer search-svg"
            onClick={() => handleOpenInput()}
          >
            🔎
          </span>
          {isInputOpen && (
            <input
              className={`search-input ${isInputOpen ? "open" : "close"}`}
              type="text"
              placeholder="Search"
              value={filterBy}
              onChange={(e) => handleInput(e)}
            />
          )}
          {/* <UserFilter filterBy={filterBy} onChangeFilter={onChangeFilter} /> */}
        </div>
        <div className="add-contact">
          {/* <Link to="/user/edit">Add contact</Link> */}
        </div>
        <UserList
          filterBy={filterBy}
          // users={users}
          onRemoveUser={onRemoveUser}
          onSelectContact={handleUserClick}
        />
      </section>
        <ChatWindow key={user?._id} />
    </section>
  )
}
