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
  const filename = path.resolve(path.dirname(resource), namespace, file)
  let dict

  return async (key) => {
    if (!dict) {
      try {
        dict = Object.assign({}, globalDict, await handler(filename, type))

        dependency && dependency(filename)
      } catch (e) {
        dict = globalDict
      }
    }

    return dict[key]
  }
}
