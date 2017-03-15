/* eslint-disable no-new-func */

const pluralCache = new Map()

export default (n, plural) => {
  if (!pluralCache.has(plural)) {
    pluralCache.set(plural, new Function('n', `return ${plural}`))
  }

  return Number(pluralCache.get(plural)(n))
}
