import { httpService } from './http.service'

export async function generateTextFromVoice(file) {
  try {
    const formData = new FormData()
    formData.append('audio', file)

    const text = await httpService.post('VoiceAi/generate-text', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return text
  } catch (error) {
    console.error(`Error generating text: ${error}`)
    throw error
  }
}
// getAudioData('blob:http://localhost:3000/1eacc4dc-c5e8-4488-91e4-7306b4fc4374')

// async function getAudioData(blobUrl) {
//   const response = await fetch(blobUrl)
//   const arrayBuffer = await response.arrayBuffer()
//   console.log('arrayBuffer', arrayBuffer)
//   return arrayBuffer
// }
