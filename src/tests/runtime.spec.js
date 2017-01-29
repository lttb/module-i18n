import I18n from '../runtime'

describe('Runtime i18n', () => {
  it('test with original', async () => {
    const value = 5
    const i18n = await I18n()

    const result = i18n.ru`yaml isomorphic test with variable ${{ value }}`

    expect(result).toEqual(`yaml изоморфный тест с переменной ${value}`)
  })

  it('test with method', async () => {
    const i18n = await I18n()

    const result = i18n.ru.testMethod()

    expect(result).toEqual('это тестовый метод')
  })

  it('test with plural', async () => {
    const i18n = await I18n()

    const plurals = {
      1: 'yaml тест',
      2: 'yaml теста',
      5: 'yaml тестов',
    }

    Object.entries(plurals).forEach(([value, text]) =>
      expect(i18n.ru(value, 'yaml test || yaml tests')).toEqual(text))
  })
})
