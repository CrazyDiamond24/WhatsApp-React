const UPLOAD_PRESET = process.env.REACT_APP_VITE_UPLOAD_PRESET
const CLOUD_NAME = process.env.REACT_APP_VITE_CLOUD_NAME
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

export const uploadImg = async (file) => {
  const FORM_DATA = new FormData()

  FORM_DATA.append('file', file)
  FORM_DATA.append('upload_preset', UPLOAD_PRESET)

  try {
    const res = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: FORM_DATA,
    })
    return res.json()
  } catch (err) {
    console.dir(err)
  }
}
