import { httpService } from './http.service'

export async function convertTextToSpeech(text) {
  try {
    const url = await httpService.post('VoiceAi/convert-text', { text })
    return url
  } catch (error) {
    console.error(`Error converting text: ${error}`)
    throw error
  }
}
