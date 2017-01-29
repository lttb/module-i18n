import path from 'path'
import handlers from './handlers'


export default ({ lang, namespace }, {
  resource,
  dependency,
  type = 'yaml',
  handler = handlers,
  globalDict = {},
  file = `${lang}.${type}`,
}) => {
  if (!resource) {
    return () => ({ methods: {}, keys: {} })
  }

  const dir = path.resolve(path.dirname(resource), namespace)

  const filename = path.join(dir, file)
  const modulename = path.join(dir, lang)

  let cache = {}

  return async () => {
    if (!cache[filename]) {
      let module
      let hasI18n = false

      const dict = { [filename]: {} }

      try {
        delete require.cache[require.resolve(modulename)]
        module = require(modulename)

        dict[filename].methods = module.default || module
        dict[filename].modulename = modulename

        hasI18n = true
      } catch (e) {
        dict[filename].methods = {}
      }

      try {
        dict[filename].keys = Object.assign(
          {},
          globalDict,
          await handler(filename, type),
        )

        hasI18n = true
      } catch (e) {
        dict[filename].keys = globalDict
      }

      hasI18n && dependency && dependency(dir)

      cache = dict
    }

    return cache[filename]
  }
}
