export const keyRegex = /\$(?:\{\s*){1,2}[`"']?(.*?)[`"']?(?:\s*\}){1,2}/g
export const pluralRegex = /\$\{[`"'](.*?)[`"']\}/g

export default ({
  keys,
  key,
  onPlural,
  onClause = _ => _,
}) => {
  const keysFormatted = Object.entries(keys).reduce((acc, [dictKey, val]) =>
    Object.assign(acc, {
      [dictKey.replace(keyRegex, '${{$1}}')]: val,
    }), {})

  const keyFormatted = key.replace(keyRegex, '${{$1}}')

  const translated = keysFormatted[keyFormatted] || key

  return translated
    .replace(pluralRegex, onPlural)
    .replace(keyRegex, onClause)
}
