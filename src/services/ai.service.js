import { httpService } from './http.service.js'

export const aiService = {
  askChatGpt,
}

async function askChatGpt(prompt, character) {
  console.log('character in ser front', character)
  return httpService.post('openai/ask', { prompt, character })
}
