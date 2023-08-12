import { httpService } from './http.service'

export async function generateImageFromText(prompt) {
  try {
    const url = await httpService.post('ImgAi/generate-image', { prompt })
    return url
  } catch (error) {
    console.error(`Error generating image: ${error}`)
    throw error
  }
}
