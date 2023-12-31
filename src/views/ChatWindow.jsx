import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addMsg } from '../store/actions/user.actions'
import { Emojis } from '../cmps/Emojis'
import { Giphy } from '../cmps/Giphy'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { socketService, SOCKET_EMIT_SEND_MSG } from '../services/socket.service'
import { msgService } from '../services/msg.service'
import Transcript from '../cmps/Transcript'
import { WelcomeChatRoom } from '../cmps/WelcomeChatRoom'
import { ConverstationList } from '../cmps/ConverstationList'
import MsgModal from '../cmps/MsgModal'
import { ReactComponent as PlusWhatsapp } from '../assets/imgs/plusWhatsapp.svg'
import { aiService } from '../services/ai.service'
import AIImageGenerator from '../cmps/AIImageGenerator'
import { showErrorMsg } from '../services/event-bus.service'

export function ChatWindow({ showWelcome, isChatHidden }) {
  const [msgContent, setMsgContent] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 })
  const [recipientIsRecording, setUserIsRecording] = useState(false)
  const [recipientIsTyping, setUserIsTyping] = useState(false)
  const [isIconRotated, setIsIconRotated] = useState(false)
  const [showAiModal, setShowAiModal] = useState(false)
  const [isGptAnswer, setIsGptAnswer] = useState(false)
  const loggedInUser = useSelector((storeState) => {
    return storeState.userModule.loggedInUser
  })
  const user = useSelector((storeState) => {
    return storeState.userModule.selectedUser
  })
  const [isUserBlocked, setIsUserBlocked] = useState(
    loggedInUser?.blockedContcats?.includes(user?._id)
  )
  const allMsgs = useSelector(
    (storeState) => storeState.userModule.loggedInUser?.msgs
  )
  const dispatch = useDispatch()
  const [animationParent] = useAutoAnimate()

  const msgs =
    loggedInUser && user
      ? msgService.filterMsgs(user, loggedInUser, allMsgs)
      : null

  useEffect(() => {
    const handleUserBlocked = (blockedData) => {
      const { blockedUserId, action } = blockedData
      if (blockedUserId === user?._id) {
        setIsUserBlocked(action === 'BLOCK_USER')
      }
    }
    setIsUserBlocked(loggedInUser?.blockedContcats?.includes(user?._id))
    socketService.on('user-block-status-updated', handleUserBlocked)

    return () => {
      socketService.off('user-block-status-updated', handleUserBlocked)
    }
  }, [user?._id])

  useEffect(() => {
    const container = document.querySelector('.conversation-container')
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [msgs])

  useEffect(() => {
    const handleTyping = (typing) => {
      const message = typing ? 'is typing...' : ''
      const userId = loggedInUser?._id
      return { userId, message }
    }
    socketService.on('typing', handleTyping(msgContent))
    return () => {
      socketService.off('typing', handleTyping(msgContent))
    }
  }, [msgContent])

  useEffect(() => {
    const handleReceivedMsg = (receivedMsg) => {
      if (receivedMsg.content) {
        const type = msgService.getReceivedMsgType(receivedMsg)
        const { content, recipientId, senderId } = receivedMsg

        dispatch(addMsg(content, recipientId, senderId, type))
      }
    }

    socketService.on('chat-add-msg', handleReceivedMsg)
    return () => {
      socketService.off('chat-add-msg', handleReceivedMsg)
    }
  }, [dispatch])

  useEffect(() => {
    let typingTimeout
    const handleTyping = (typingData) => {
      const { userId, isTyping } = typingData
      if (userId !== loggedInUser?._id) {
        setUserIsTyping(isTyping)
        clearTimeout(typingTimeout)
        if (isTyping) {
          typingTimeout = setTimeout(() => {
            setUserIsTyping(false)
          }, 1000)
        }
      }
    }
    socketService.on('user-typing', handleTyping)
    return () => {
      socketService.off('user-typing', handleTyping)
    }
  }, [user?._id])

  // useEffect(() => {
  //   const handleUserStatusUpdate = (userStatusUpdate) => {
  //     console.log('userStatusUpdate', userStatusUpdate)
  //     // if (userStatusUpdate.userId && userStatusUpdate.userId === user._id) {
  //     showOnline(true)
  //     // }
  //   }
  //   socketService.on('user-updated', handleUserStatusUpdate)
  //   return () => {
  //     socketService.off('user-updated', handleUserStatusUpdate)
  //   }
  // }, [user?._id])

  useEffect(() => {
    const handleRecording = (recordingData) => {
      const { userId, isRecording } = recordingData
      if (userId !== loggedInUser?._id) {
        setUserIsRecording(isRecording)
      }
    }
    socketService.on('user-recording', handleRecording)
    return () => {
      socketService.off('user-recording', handleRecording)
    }
  }, [user?._id])

  async function askGpt(contentToSend) {
    setIsGptAnswer(true)
    try {
      dispatch(
        addMsg(
          contentToSend.content,
          contentToSend.recipientId,
          contentToSend.senderId,
          'text'
        )
      )
      console.log('user.character', user.character)

      const res = await aiService.askChatGpt(
        contentToSend.content,
        user.character
      )

      console.log('user', user)
      dispatch(addMsg(res, loggedInUser._id, user._id, 'text'))
    } catch (error) {
      console.error('An error occurred while asking GPT:', error)
    } finally {
      setIsGptAnswer(false)
    }
  }

  function handelSendMsg(e) {
    e.preventDefault()
    if (!loggedInUser || !user || !msgContent.length || isUserBlocked) return
    const trimmedContent = msgContent.trim()

    if (trimmedContent) {
      const contentToSend = {
        content: trimmedContent,
        senderId: loggedInUser._id,
        recipientId: user._id,
      }
      setMsgContent('')
      if (user.fullName === 'gpt') return askGpt(contentToSend)
      socketService.emit(SOCKET_EMIT_SEND_MSG, contentToSend)
    }
  }

  function handleInputChange(e) {
    setMsgContent(e.target.value)
    const trimmedContent = e.target.value.trim()
    const isTyping = trimmedContent !== ''
    socketService.emit('typing', {
      senderId: loggedInUser._id,
      recipientId: user._id,
      isTyping,
    })
  }

  function handleEmojiSelect(emoji) {
    setMsgContent((prevMsg) => prevMsg + emoji)
  }

  function handlefilesSelect(url, type) {
    const contentToSend = msgService.getMsgType(url, loggedInUser, user, type)
    console.log('contentToSend', contentToSend)
    if(isUserBlocked) return
    if (user.fullName === 'gpt') return showErrorMsg('You cant send this msg to Ai tool')
    socketService.emit(SOCKET_EMIT_SEND_MSG, contentToSend)
    setMsgContent('')
  }

  function handleShowModal(e) {
    e.stopPropagation()
    const rect = e.target.getBoundingClientRect()
    setModalPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    })
    setShowModal(!showModal)
    setIsIconRotated(!isIconRotated)
  }

  function timestamp(time) {
    return msgService.getTimestamp(time)
  }

  function handleOpenAiModal() {
    setShowAiModal(true)
  }

  function handleCloseAiModal() {
    setShowAiModal(false)
  }

  function handleCloseModal() {
    setShowModal(false)
    setIsIconRotated(false)
  }

  return (
    <div
      className={` ${isChatHidden ? 'hide-chat' : 'chat-window'}`}
      ref={animationParent}
      style={{
        backgroundImage: loggedInUser?.userPref?.backgroundImage
          ? `url(${loggedInUser?.userPref?.backgroundImage})`
          : '',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {user && !showWelcome ? (
        <>
          <div
            className="header-area"
            style={{ backgroundColor: loggedInUser?.userPref?.headerBgColor }}
          >
            <div className="header-image-wrapper">
              <img src={user?.img} alt={user?.username} />
              {user.isOnline && <span className="online-indicator"></span>}
            </div>
            <div className="user-details">
              <h2 className="user-fullname">{user?.fullName}</h2>
              {user.isOnline ? (
                <div className="online-status-word">Online</div>
              ) : (
                <div className="status-info">
                  Last Seen: {timestamp(user.lastSeen)}
                </div>
              )}
            </div>

            {(recipientIsTyping || isGptAnswer) && <div className='typing'>is typing...</div>}
            {recipientIsRecording && <div>is recording...</div>}
          </div>
          <ul className="conversation-container flex" ref={animationParent}>
            <ConverstationList
              msgs={msgs}
              loggedInUser={loggedInUser}
              user={user}
              isUserBlocked={isUserBlocked}
            />
          </ul>
          <form className="msg-input" onSubmit={(e) => handelSendMsg(e)}>
            <div className="multimedia-container">
              <Giphy
                onSelectGif={(gifImgUrl) =>
                  handlefilesSelect(gifImgUrl, 'image')
                }
              />
              <Emojis onSelectEmoji={handleEmojiSelect} />
            </div>
            <div className="chat-input-container">
              {showModal && (
                <MsgModal
                  msgText={msgContent}
                  position={modalPosition}
                  onSelectImage={(gifImgUrl) =>
                    handlefilesSelect(gifImgUrl, 'image')
                  }
                  onSelectVideo={(url) => handlefilesSelect(url, 'video')}
                  onSendVoice={(url) => handlefilesSelect(url, 'audio')}
                  onSelectFile={(url) => handlefilesSelect(url, 'file')}
                  openAiModal={handleOpenAiModal}
                  onClose={handleCloseModal}
                />
              )}

              <PlusWhatsapp
                title="Attach"
                className={`plus-icon-svg ${isIconRotated ? 'rotate' : ''}`}
                onClick={(e) => handleShowModal(e)}
              />

              <input
                className="chat-msg-input"
                type="text"
                placeholder="Type a message..."
                value={msgContent}
                onChange={handleInputChange}
              />

              <Transcript
                title="Record"
                onSelectAudio={(audioUrl) =>
                  handlefilesSelect(audioUrl, 'audio')
                }
                className="transcript-container"
              />
            </div>
          </form>
          {showAiModal && (
            <AIImageGenerator
              closeAiModal={handleCloseAiModal}
              onImageGenerated={(gifImgUrl) =>
                handlefilesSelect(gifImgUrl, 'image')
              }
            />
          )}
        </>
      ) : (
        <WelcomeChatRoom />
      )}
    </div>
  )
}
