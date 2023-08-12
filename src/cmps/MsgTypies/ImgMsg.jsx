import React from 'react'
export function ImgMsg({ msg }) {
  console.log('hi')
  return <img className="gif-msg" src={msg?.content} alt="GIF" />
}
