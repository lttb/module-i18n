import stringReplaceAsync from 'string-replace-async'

import prepareClause from '~/common/Clause'


export default ({ namespace, dictionary }) => {
  const clauseRegexp = new RegExp(`[\\w.]*${namespace}\`([\\s\\S]*?(\\$\\{.*?\\})?)\``, 'g')

  const replacer = async (_, key) =>
    `\`${prepareClause({
      key,
      keys: (await dictionary()).keys,
      onPlural: (match, val) => `$\{${namespace}(${val})}`,
    })}\``

  return async source => stringReplaceAsync(await source, clauseRegexp, replacer)
}
