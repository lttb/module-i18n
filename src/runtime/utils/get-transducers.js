/* eslint-disable no-eval */

import preparePlural from '~/common/Plural'
import prepareClause from '~/common/Clause'


const pluralHelper = (n, plural) => Number(eval(plural))

export default ({ lang, defaultLang, keys, plurals }) => {
  const Plural = (value, key, currLang) => {
    const { pluralArr, plural } = preparePlural({
      keys,
      key,
      lang,
      plurals,
      defaultLang: currLang || defaultLang,
    })

    return pluralArr && plural
      ? pluralArr[pluralHelper(Math.abs(value), plural)]
      : ''
  }

  const Clause = (strings, ...values) => {
    const valuesMap = (values || []).reduce((acc, val) =>
      Object.assign(acc, typeof val === 'object'
        ? val
        : { [val]: typeof val === 'function' ? val() : val }), {})

    const key = strings
        .map((string, index) => (!values[index]
          ? string
          : string.concat(typeof values[index] !== 'object'
            ? `$\{\`${values[index]}\`}`
            : `$\{{${Object.keys(values[index])[0]}}}`)))
        .join('')

    const onPlural = (match, val) =>
      (Plural(...val
        .trim()
        .split(/\s*,\s*/)
        .map((name, index) => (name in valuesMap
          ? valuesMap[name]
          : name.slice(...index ? [1, -1] : [0])))) || match)

    const onClause = (match, name) => (name in valuesMap ? valuesMap[name] : name)

    return prepareClause({ keys, key, onPlural, onClause })
  }

  return { Plural, Clause }
}
