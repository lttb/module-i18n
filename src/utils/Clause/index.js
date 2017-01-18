import stringReplaceAsync from 'string-replace-async'


export default ({ namespace, dictionary }) => {
  const clauseRegexp = new RegExp(`${namespace}\`([\\s\\S]*?)\``, 'g')

  const replacer = async (_, key) =>
    `\`${await dictionary(key) || key}\``

  return async source => stringReplaceAsync(await source, clauseRegexp, replacer)
}
