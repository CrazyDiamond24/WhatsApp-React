import { httpService } from './http.service'

export async function generateTextFromVoice(file) {
  console.log('file', file)
  try {
    const formData = new FormData()
    formData.append('audio', file)

    const text = await httpService.post('TextAi/convert-audio', formData, {
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
