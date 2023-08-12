import { httpService } from './http.service.js'

export const aiService = {
  askChatGpt,
}

async function askChatGpt(prompt, character) {
  return httpService.post('openai/ask', { prompt, character })
}
