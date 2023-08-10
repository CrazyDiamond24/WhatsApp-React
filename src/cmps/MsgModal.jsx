import React, { useState } from 'react'
import { uploadImg } from '../services/upload-img.service'
import { uploadVideo } from '../services/upload-video.service'
import { uploadFile } from '../services/upload-file.service'
import { getSpotifySvg } from '../services/SVG.service'
import { TakePicture } from './TakePicture'
import { Navigate, useNavigate } from 'react-router-dom'

export default function MsgModal({
  position,
  onSelectImage,
  onSelectFile,
  onSelectVideo,
}) {
  const navigate = useNavigate()
  async function handleImg(ev) {
    const file =
      ev.type === 'change' ? ev.target.files[0] : ev.dataTransfer.files[0]
    try {
      const { url } = await uploadImg(file)
      onSelectImage(url)
    } catch (err) {
      console.log('err', err)
    }
  }

  async function handleVideoFile(ev) {
    const file =
      ev.type === 'change' ? ev.target.files[0] : ev.dataTransfer.files[0]
    try {
      const { url } = await uploadVideo(file)
      onSelectVideo(url)
    } catch (err) {
      console.log('err', err)
    }
  }

  async function handleFile(ev) {
    const file =
      ev.type === 'change' ? ev.target.files[0] : ev.dataTransfer.files[0]
    try {
      const { url } = await uploadFile(file)
      console.log('url', url)
      onSelectFile(url)
    } catch (err) {
      console.log('err', err)
    }
  }

  function handleShowModal() {
    navigate('user/take/picture')
  }

  return (
    <section className="msg-modal-section">
      <ul>
        <li>
          <div>
            <span
              dangerouslySetInnerHTML={{
                __html: getSpotifySvg('imageWhatsapp'),
              }}
            ></span>
          </div>
          <p>images</p>
          <label>
            <input type="file" onChange={handleImg} className="hidden" />
          </label>
        </li>
        <li>
          <div>
            <span
              dangerouslySetInnerHTML={{
                __html: getSpotifySvg('imageWhatsapp'),
              }}
            ></span>
          </div>
          <p>videos</p>
          <label>
            <input type="file" onChange={handleVideoFile} className="hidden" />
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
          <p>camera</p>
        </li>
        <li>
          <div>
            <span
              dangerouslySetInnerHTML={{
                __html: getSpotifySvg('fileWhatsapp'),
              }}
            ></span>
          </div>
          <p>files</p>
          <label>
            <input
              type="file"
              onChange={handleFile}
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
              className="hidden"
            />
          </label>
        </li>
      </ul>
      {/* {showModal && <TakePicture />} */}
    </section>
  )
}
