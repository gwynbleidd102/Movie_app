export const trimDescription = (text, normalLength = 200) => {
  text = text.trim()
  if (text.length <= normalLength) {
    return text
  }
  let trimmedText = text.substring(0, normalLength)
  trimmedText = trimmedText.substring(0, trimmedText.lastIndexOf(' '))
  return `${trimmedText}...`
}
