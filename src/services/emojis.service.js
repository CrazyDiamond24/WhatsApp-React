import emojiData from 'emoji-datasource'

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

export const emojisService = {
  fetchEmojis,
}
