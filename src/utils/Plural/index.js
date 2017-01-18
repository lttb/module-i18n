import stringReplaceAsync from 'string-replace-async'

import pluralsDefaults from './plurals'
import pluralInliner from './inliner'


const pluralArgsRegex = /[\s\n]*,[\s\n]*/
const pluralVariantsRegex = /[\s\n]*\|{2}[\s\n]*/

export default ({
  namespace,
  lang,
  dictionary,
  defaultLang,
  plurals = pluralsDefaults,
}) => {
  const pluralRegexp = new RegExp(`${namespace}_?(\\w*?)\\(([\\s\\S]*?)\\)`, 'g')

  const replacer = async (match, currLang, string) => {
    const [value, ...keys] = string.trim().split(pluralArgsRegex)
    const dictKey = keys.join().slice(1, -1)

    let pluralArr = await dictionary(dictKey)
    let pluralLang = lang

    if (!(pluralArr && pluralArr.length)) {
      pluralArr = dictKey.split(pluralVariantsRegex)
      pluralLang = currLang || defaultLang
    }

    if (!plurals[pluralLang]) {
      throw Error(`There are no plural forms for: ${JSON.stringify({
        lang,
        match,
      })}`)
    }

    const [arity, plural] = plurals[pluralLang]

    if (pluralArr.length !== arity) {
      throw Error(`Different arity for plural forms: ${JSON.stringify({
        lang,
        match,
        arity,
        plural,
      })}`)
    }

    return pluralInliner({
      arity,
      pluralArr,
      plural: plural.replace(/n/g, value),
    })
  }

  return async source => stringReplaceAsync(await source, pluralRegexp, replacer)
}
