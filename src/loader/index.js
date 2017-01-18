import Replacer from '../'


export default function (source) {
  this.cacheable()

  const callback = this.async()

  const { type, handler, globalDict, ...i18n } = this.query
  const { resource, dependency } = this

  const dict = {
    type,
    handler,
    globalDict,
    resource,
    dependency,
  }

  Replacer(source, { i18n, dict })
    .then(result => callback(null, result))
    .catch(callback)
}
