import React from 'react'

import { getSpotifySvg } from '../services/SVG.service'

export default function MsgModal({ position }) {
  return (
    <section
      className="msg-modal-section"
    >
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
        </li>
        <li>
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
        </li>
      </ul>
    </section>
  )
}
