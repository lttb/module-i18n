/* istanbul ignore next */
/* eslint-disable object-curly-spacing */

module.exports = (i18n) => {
  const clause = i18n`This is test message`

  const messages = 5
  const plural = i18n(messages, 'message || messages')

  const value = i18n`Total messages: ${{ messages }}`
  const valueCodestyle = i18n`Total messages codestyle: ${{messages}}`
  const valueDifferentCodestyle = i18n`Total messages different codestyle: ${{ messages }}`

  const combo = i18n`You have ${{ messages }} new ${`messages, 'message || messages'`}`

  const customMethod = i18n.customMethod()
  const customKey = i18n.customKey

  return {
    clause,
    plural,
    value,
    valueCodestyle,
    valueDifferentCodestyle,
    combo,
    customMethod,
    customKey,
  }
}
