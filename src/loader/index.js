import Dictionary from '~/common/Dictionary'

import Plural from './utils/Plural'
import Clause from './utils/Clause'


const prepareOptions = ({ i18n, dict }) => {
  const options = Object.assign({
    namespace: 'i18n',
    defaultLang: 'en',
  }, i18n)

  const dictionary = Dictionary(options, dict)

  return Object.assign({ dictionary }, options)
}

const format = async source =>
  (await source).replace(/\$\{{2}(.*?)\}{2}/g, '${$1}')


export default (source, options) => {
  const translateOptions = prepareOptions(options)

  const clause = Clause(translateOptions)
  const plural = Plural(translateOptions)

  return format(plural(clause(source)))
}
