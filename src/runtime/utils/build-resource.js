import initor from './initor'


export default ({ i18n, dict, files, resource }) => {
  const { type = 'yaml' } = i18n

  const isDict = new RegExp(`\\.${type}$`)

  return files
    .filter(isDict.test.bind(isDict))
    .reduce(async (acc, file) => {
      const lang = file.replace(isDict, '')

      return {
        ...await acc,
        [lang]: await initor({
          i18n: { lang },
          dict: Object.assign({
            resource,
          }, dict),
        }),
      }
    }, {})
}
