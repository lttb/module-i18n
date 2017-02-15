import Dictionary from '~/common/Dictionary'

import getTransducers from './get-transducers'


const prepareOptions = async ({ i18n, dict }) => {
  const options = Object.assign({
    namespace: 'i18n',
    defaultLang: 'en',
  }, i18n)

  const dictionary = await (Dictionary(options, dict)())

  return Object.assign({ dictionary }, options)
}


export default async (options) => {
  const { dictionary: { keys, methods }, ...i18n } = await prepareOptions(options)

  const { Clause, Plural } = getTransducers(Object.assign({ keys }, i18n))

  return Object.assign((...args) => {
    if (args[0].raw) return Clause(...args)

    return Plural(...args)
  }, methods)
}
