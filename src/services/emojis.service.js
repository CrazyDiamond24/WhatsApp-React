import axios from 'axios'

async function fetchEmojis() {
  try {
    const response = await axios.get(
      `https://emoji-api.com/emojis?access_key=${process.env.REACT_APP_EMOJIS_KEY}`
    )
    return response.data.map((emoji) => emoji.character)
  } catch (error) {
    console.error('Failed to fetch emojis', error)
  }
}

export const emojisService = {
  fetchEmojis,
}
