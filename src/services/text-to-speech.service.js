import { httpService } from './http.service'

export async function convertTextToSpeech(text, voice) {
  try {
    const url = await httpService.post('VoiceAi/convert-text', { text, voice })
    return url
  } catch (error) {
    console.error(`Error converting text: ${error}`)
    throw error
  }
}
