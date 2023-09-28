import React from 'react'
export function ImgMsg({ msg }) {
  return <img className="gif-msg" src={msg?.content} alt="GIF" />
}
