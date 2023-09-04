import React, { useEffect, useRef, useState } from 'react'
import { uploadImg } from '../services/upload-img.service'
import { uploadVideo } from '../services/upload-video.service'
import { uploadFile } from '../services/upload-file.service'
import { getSpotifySvg } from '../services/SVG.service'
import { convertTextToSpeech } from '../services/text-to-speech.service'
import { useNavigate } from 'react-router-dom'
import { VoiceModal } from './VoiceModal'
import { TakePicture } from './TakePicture'

export default function MsgModal({
  onSelectImage,
  msgText,
  onSelectFile,
  onSelectVideo,
  openAiModal,
  onSelectAudio,
  onSendVoice,
  onClose,
}) {
  const navigate = useNavigate()

  const [showCameraModal, setShowCameraModal] = useState(false)
  const [showVoiceModal, setShowVoiceModal] = useState(false)

  // const [showVoiceModal, setShowVoiceModal] = useState(false)

  // async function handleImg(ev) {
  //   const file =
  //     ev.type === 'change' ? ev.target.files[0] : ev.dataTransfer.files[0]
  //   try {
  //     const { url } = await uploadImg(file)
  //     onSelectImage(url)
  //   } catch (err) {
  //     console.log('err', err)
  //   }
  // }

  // async function handleVideoFile(ev) {
  //   const file =
  //     ev.type === 'change' ? ev.target.files[0] : ev.dataTransfer.files[0]
  //   try {
  //     const { url } = await uploadVideo(file)
  //     onSelectVideo(url)
  //   } catch (err) {
  //     console.log('err', err)
  //   }
  // }

  // async function handleFile(ev) {
  //   const file =
  //     ev.type === 'change' ? ev.target.files[0] : ev.dataTransfer.files[0]
  //   try {
  //     const { url } = await uploadFile(file)
  //     onSelectFile(url)
  //   } catch (err) {
  //     console.log('err', err)
  //   }
  // }

  async function handleMedia(ev, mediaType) {
    const file =
      ev.type === 'change' ? ev.target.files[0] : ev.dataTransfer.files[0]
    try {
      let res
      switch (mediaType) {
        case 'image':
          res = await uploadImg(file)
          onSelectImage(res.url)
          break
        case 'video':
          res = await uploadVideo(file)
          onSelectVideo(res.url)
          break
        case 'file':
          res = await uploadFile(file)
          onSelectFile(res.url)
          break
        default:
          console.log('Invalid media type')
          break
      }
    } catch (err) {
      console.log('err', err)
    }
  }

  function handleShowModal() {
    setShowCameraModal(true)
  }

  // useEffect(() => {
  //   function handleClickOutside(event) {
  //     if (msgModalRef.current && !msgModalRef.current.contains(event.target)) {
  //       onClose()
  //     }
  //   }

  //   document.addEventListener('mousedown', handleClickOutside)
  //   return () => {
  //     // Remove the event listener when the component is unmounted
  //     document.removeEventListener('mousedown', handleClickOutside)
  //   }
  // }, [onClose])

  // const vocie = 'CYw3kZ02Hs0563khs1Fj'
  function handleTextToVoice() {
    setShowVoiceModal(true)
    // try {
    //   const url = await convertTextToSpeech(msgText, vocie)
    //   console.log('url', url)
    //   // Instead of setting the audio URL in a state,
    //   // you can pass it to ChatWindow to handle the sending part.
    //   // Or handle the sending right here.
    //   onSelectAudio(url.file) // Assuming you want to use the onSelectFile prop for this purpose
    // } catch (error) {
    //   console.error(error)
    // }
  }

  function handleCloseVoiceModal() {
    setShowVoiceModal(false)
  }
  function handleCloseCameraModal() {
    setShowCameraModal(false)
  }

  const msgModalRef = useRef(null)

  return (
    <>
      <section className="msg-modal-section" ref={msgModalRef}>
        <ul>
          <li>
            <div>
              <span
                dangerouslySetInnerHTML={{
                  __html: getSpotifySvg('imageWhatsapp'),
                }}
              ></span>
            </div>
            <p>Photo</p>
            <label>
              <input
                type="file"
                onChange={(ev) => handleMedia(ev, 'image')}
                className="hidden"
              />
            </label>
          </li>
          <li onClick={openAiModal}>
            <div>
              <span
                dangerouslySetInnerHTML={{
                  __html: getSpotifySvg('imageWhatsapp'),
                }}
              ></span>
            </div>
            <p>AI Generated Art</p>
          </li>
          <li onClick={handleTextToVoice}>
            <p>Convert to voice msg</p>
          </li>
          <li>
            <div>
              <span
                dangerouslySetInnerHTML={{
                  __html: getSpotifySvg('imageWhatsapp'),
                }}
              ></span>
            </div>
            <p>Video</p>
            <label>
              <input
                type="file"
                onChange={(ev) => handleMedia(ev, 'video')}
                className="hidden"
              />
            </label>
          </li>
          <li onClick={handleShowModal}>
            <div>
              <span
                dangerouslySetInnerHTML={{
                  __html: getSpotifySvg('cameraWhatsapp'),
                }}
              ></span>
            </div>
            <p>Camera</p>
          </li>
          <li>
            <div>
              <span
                dangerouslySetInnerHTML={{
                  __html: getSpotifySvg('fileWhatsapp'),
                }}
              ></span>
            </div>
            <p>File</p>
            <label>
              <input
                type="file"
                onChange={(ev) => handleMedia(ev, 'file')}
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                className="hidden"
              />
            </label>
          </li>
        </ul>
        {showCameraModal && <TakePicture closeModal={handleCloseCameraModal} />}
      </section>
      {showVoiceModal && (
        <VoiceModal
          onSelectAudio={onSendVoice}
          msg={msgText}
          closeModal={handleCloseVoiceModal}
        />
      )}
    </>
  )
}
