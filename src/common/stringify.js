export default (object) => {
  const placeholder = '_PLACEHOLDER_'
  const getHash = key => `_${placeholder}_${key}_`

  const fn = {}

  const JSONreplacer = (key, value) => {
    if (typeof value === 'function') {
      const hash = getHash(key)
      fn[hash] = value.toString()

      return hash
    }

    return value
  }

  const json = JSON.stringify(object, JSONreplacer)

  return json.replace(new RegExp(`"(_${placeholder}_.*?_)"`, 'g'), (match, hash) => fn[hash])
}
