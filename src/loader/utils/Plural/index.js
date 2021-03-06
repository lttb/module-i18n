import stringReplaceAsync from 'string-replace-async'

import stringify from '~/common/stringify'
import preparePlural from '~/common/Plural'

import pluralInliner from './inliner'


const pluralArgsRegex = /[\s\n]*,[\s\n]*/


export default ({
  namespace,
  lang,
  supported,
  dictionary,
  defaultLang,
  plurals,
}) => {
  const customKeyRegexp = new RegExp(`.*${namespace}`)
  const moduleNamespace = `${namespace}_methods`
  const pluralRegexp = new RegExp(`[\\w.]*(?:\\(\\.*?\\)\\s*=>\\s*)?${namespace}(?:\\.(\\w*))?(?:\\(([\\s\\S]*?)\\))?`, 'ig')

  const replacer = async (match, prop, string) => {
    if (!(prop || string)) return match

    if (prop === 'supported') return JSON.stringify((supported || [lang]).sort())
    if (prop === 'current') return JSON.stringify(lang)

    const { methods, keys } = await dictionary()

    if (methods[prop]) {
      return match.replace(customKeyRegexp, moduleNamespace)
    }

    const [value, pluralKey, currLang] = string.trim().split(pluralArgsRegex)
    const key = pluralKey.slice(1, -1)

    try {
      const {
        arity,
        plural,
        pluralArr,
      } = preparePlural({
        keys,
        key,
        lang,
        plurals,
        defaultLang: currLang ? currLang.slice(1, -1) : defaultLang,
      })

      return pluralInliner({
        arity,
        pluralArr,
        plural: plural.replace(/n/g, `Math.abs(${value})`),
      }).replace(/\$\{(.*?)\}/, '$1')
    } catch (e) {
      throw Error(`module-i18n loader error for in '${match}'. ${e.message}`)
    }
  }

  return async (source) => {
    const result = await stringReplaceAsync(await source, pluralRegexp, replacer)

    return result.includes(moduleNamespace)
      ? `const ${moduleNamespace} = ${stringify((await dictionary()).methods)};\n`.concat(result)
      : result
  }
}
