import { useCallback, useEffect, useState } from 'react'
import { UserList } from '../cmps/UserList'
import { useDispatch, useSelector } from 'react-redux'
import { loadUsers, removeUser } from '../store/actions/user.actions'
import { ChatWindow } from './ChatWindow'
import { AppHeader } from '../cmps/AppHeader'
import { UserProfile } from '../cmps/UserProfile'
import { ReactComponent as SearchIcon } from '../assets/imgs/searchIcon.svg'
import { AddContactIcon } from '../cmps/svgs/AddContactIcon'
import { ReusableModal } from '../cmps/ReusableModal'
import { AddContact } from './AddContact'

export function UserIndex() {
  const [filterBy, setFilterBy] = useState('')
  const [isShowProfile, setIsShowProfile] = useState(false)
  const [isInputOpen, setIsInputOpen] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [activeUserChat, setActiveUserChat] = useState(false)
  const [showCamera, setShowCamera] = useState(true)
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false)
  const [isChatHidden, setIsChatHidden] = useState(false)
  const [isListShown, setIsListShown] = useState(false)

  function toggleDisplay() {
    if (window.innerWidth <= 768) {
      setIsChatHidden((prevIsChatHidden) => !prevIsChatHidden);
      setIsListShown((prevIsListShown) => !prevIsListShown);
    }
  }
  

  const user = useSelector((storeState) => {
    return storeState.userModule.selectedUser
  })

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadUsers())
  }, [user])

  function openWelcomeChat() {
    setShowWelcome(true)
    setActiveUserChat(false)
  }

  function openUserChat(userId) {
    // set the active user here...
    setShowWelcome(false)
    setActiveUserChat(true)
  }
  function openAddContactModal() {
    setIsAddContactModalOpen(true)
  }

  function closeAddContactModal() {
    setIsAddContactModalOpen(false)
  }

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

  function handleCloseModal() {
    setShowCamera(false)
  }

  // if (!users) return <div>Loading...</div>

  return (
    <section className='home-page'>
      {!isShowProfile ? (
        <section className={`${isListShown ? 'show-list' : 'contact-list'}`}>
          <AppHeader
            openWelcomeChat={openWelcomeChat}
            showProfile={handleShowProfile}
          />

          <div className='action-container'>
            <div className='svg-input-container'>
              <span
                className='pointer search-svg'
                onClick={() => handleOpenInput()}
              >
                <SearchIcon
                  className={`search-icon-svg ${
                    isInputOpen ? 'icon-open' : 'icon-close'
                  }`}
                />
              </span>
              <input
                className={`search-input ${isInputOpen ? 'open' : 'close'}`}
                type='text'
                placeholder='Search contacts or conversations...'
                value={filterBy}
                onChange={(e) => handleInput(e)}
              />
            </div>

            <div className='add-contact'>
              <button onClick={openAddContactModal}>
                <AddContactIcon />
              </button>
            </div>
            <ReusableModal
              isOpen={isAddContactModalOpen}
              onClose={closeAddContactModal}
            >
              <AddContact onAdded={closeAddContactModal} />
            </ReusableModal>
          </div>

          <UserList
            openUserChat={openUserChat}
            filterBy={filterBy}
            onRemoveUser={onRemoveUser}
            toggleDisplay={toggleDisplay}
          />

          <div className='accessory-list'></div>
        </section>
      ) : (
        <UserProfile
          show={isShowProfile}
          closeUserProfile={handleCloseUserProfile}
        />
      )}

      {/* {!showCamera ? ( */}
      <span class="back-btn" onClick={toggleDisplay}>
  <svg class="arrow-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4L4 12L12 20M20 12H4H20Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</span>


      <ChatWindow
        isChatHidden={isChatHidden}
        showWelcome={showWelcome}
        openUserChat={openUserChat}
        key={user?._id}
      />

      {/* ) : ( */}
      {/* <TakePicture closeModal={handleCloseModal} /> */}
      {/* )} */}
    </section>
  )
}
