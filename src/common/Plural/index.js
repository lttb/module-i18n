import pluralsDefaults from './plurals'


const pluralVariantsRegex = /[\s\n]*\|{2}[\s\n]*/


export default ({ keys, key, lang, defaultLang, plurals = pluralsDefaults }) => {
  if (!key) return ''

  let pluralArr = keys[key]
  let pluralLang = lang

  if (!(pluralArr && pluralArr.length)) {
    pluralArr = key.split(pluralVariantsRegex)
    pluralLang = defaultLang
  }

  if (!plurals[pluralLang]) {
    throw Error(`There are no plural forms or custom methods for: ${JSON.stringify({
      lang,
    })}`)
  }

  const [arity, plural] = plurals[pluralLang]

  if (pluralArr.length !== arity) {
    throw Error(`Different arity for plural forms: ${JSON.stringify({
      lang,
      arity,
      plural,
    })}`)
  }

  return { arity, plural, pluralArr }
}
