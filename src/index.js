import Plural from './utils/Plural'
import Clause from './utils/Clause'
import Dictionary from './utils/Dictionary'


const prepareOptions = ({ i18n, dict }) => {
  const options = Object.assign({
    namespace: 'i18n',
    defaultLang: 'en',
  }, i18n)

  const dictionary = Dictionary(options, dict)

  return Object.assign({ dictionary }, options)
}

export default (source, options) => {
  const translateOptions = prepareOptions(options)

  const clause = Clause(translateOptions)
  const plural = Plural(translateOptions)

  return plural(clause(source))
}
