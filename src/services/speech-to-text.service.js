import { httpService } from './http.service'

export async function convertAudioToText(file) {
  const formData = new FormData()
  formData.append('audio', file)

  try {
    const response = await httpService.post('TextAi/convert-audio', formData)
    return response.data
  } catch (error) {
    console.error(`Error converting audio: ${error}`)
    throw error
  }
}
