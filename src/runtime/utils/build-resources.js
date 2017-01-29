import path from 'path'

import initor from './initor'
import getResource from './get-resource'


export default async ({ i18n = {}, dict = {}, files }) => {
  const { namespace = 'i18n', defaultLang = 'en' } = i18n

  const fileRegex = new RegExp(`\\/${namespace}\\/(.*?)\\..*`)

  const table = await files
    .filter(fileRegex.test.bind(fileRegex))
    .reduce(async (acc, file) => {
      const [, lang] = file.match(fileRegex)
      const resource = file.replace(fileRegex, `/${namespace}`)

      const current = await acc

      return {
        ...current,
        [lang]: {
          ...current[lang],
          [resource]: await initor({
            i18n: { lang },
            dict: Object.assign({
              resource,
            }, dict),
          }),
        },
      }
    }, {
      [defaultLang]: {
        '*': await initor({
          i18n: { lang: defaultLang },
          dict,
        }),
      },
    })

  const supported = Object.keys(table).sort()

  return new Proxy(table, {
    get: (t, lang) => {
      if (lang === 'supported') {
        return supported
      }

      if (!t[lang] && lang !== defaultLang) {
        return undefined
      }

      return new Proxy(Object.assign(() => {}, t[lang]), {
        get: (target, prop) => {
          if (prop === 'supported') {
            return supported
          }

          if (prop === 'current') {
            return lang
          }

          const resource = path.resolve(path.dirname(getResource()), namespace)

          if (!(target[resource] && target[resource][prop])) {
            return target
          }

          return target[resource][prop]
        },

        apply: (target, thisArg, args) => {
          const resource = path.resolve(path.dirname(getResource()), namespace)

          if (target[resource]) {
            return target[resource](...args)
          }

          return t[defaultLang]['*'](...args)
        },
      })
    },
  })
}
