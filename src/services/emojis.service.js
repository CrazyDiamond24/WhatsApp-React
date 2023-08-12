import emojiData from 'emoji-datasource'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { utilService } from '../services/util.service'

const giphyFetch = new GiphyFetch('KRJj7rArYYq9avub9yRoWar6P2SvYhje')

function fetchEmojis() {
  const emojisByCategory = emojiData.reduce((categories, emoji) => {
    if (!categories[emoji.category]) {
      categories[emoji.category] = []
    }
    categories[emoji.category].push(
      String.fromCodePoint(...emoji.unified.split('-').map((u) => '0x' + u))
    )
    return categories
  }, {})

  return emojisByCategory
}

async function fetchGiphy(query, limit = 20) {
  try {
    const cacheKey = `giphy_${query}`
    const cachedResult = utilService.loadFromStorage(cacheKey)

    if (cachedResult) {
      return cachedResult
    } else {
      const gifs = await giphyFetch.search(query, { limit })
      utilService.saveToStorage(cacheKey, gifs.data)
      return gifs.data
    }
  } catch (error) {
    console.error('Error fetching GIFs:', error)
    return []
  }
}


async function fetchTrendingGiphy(limit = 20) {
  try {
    const cacheKey = 'giphy_trending'
    const cachedResult = utilService.loadFromStorage(cacheKey)

    if (cachedResult) {
      return cachedResult
    } else {
      const gifs = await giphyFetch.trending({ limit })
      utilService.saveToStorage(cacheKey, gifs.data)
      return gifs.data
    }
  } catch (error) {
    console.error('Error fetching trending GIFs:', error)
    return []
  }
}


export const emojisService = {
  fetchEmojis,
  fetchGiphy,
  fetchTrendingGiphy
}
