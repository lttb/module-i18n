import loader from '../loader'


const options = ({ i18n, dict } = {}) => ({
  get i18n() {
    return Object.assign({
      lang: 'ru',
    }, i18n)
  },

  get dict() {
    return Object.assign({
      dependency: jest.fn(),
      resource: __filename,
    }, dict)
  },
})

describe('Loader i18n', () => {
  it('test with original', async () => {
    const sourceMock = 'i18n`original i18n test`'

    const result = await loader(sourceMock, options())

    expect(result).toEqual('`original i18n test`')
  })

  it('test with default options', async () => {
    const sourceMock = 'i18n`yaml i18n test`'

    const result = await loader(sourceMock, options())

    expect(result).toEqual('`yaml тест перевода`')
  })

  it('test with default options with context', async () => {
    const sourceMock = 'this.context.i18n`yaml i18n test`'

    const result = await loader(sourceMock, options())

    expect(result).toEqual('`yaml тест перевода`')
  })

  it('test with variable with default options', async () => {
    const sourceMock = 'i18n`yaml test with variable ${value}`'

    const result = await loader(sourceMock, options())

    expect(result).toEqual('`yaml тест с переменной ${value}`')

    const value = 'test'
    expect(eval(result)).toEqual(`yaml тест с переменной ${value}`)
  })

  it('test with global dictionary', async () => {
    const sourceMock = 'i18n`global dict test`'

    const result = await loader(sourceMock, options({
      dict: {
        globalDict: {
          'global dict test': 'тест глобального словаря',
        },
      },
    }))

    expect(result).toEqual('`тест глобального словаря`')
  })

  it('test json', async () => {
    const sourceMock = 'i18n`json i18n test`'

    const result = await loader(sourceMock, options({
      dict: {
        type: 'json',
      },
    }))

    expect(result).toEqual('`json тест перевода`')
  })

  it('test with multiline', async () => {
    const sourceMock = `i18n\`yaml multiline
i18n test
\``
    const result = await loader(sourceMock, options())

    expect(result).toEqual(`\`yaml многострочный
i18n тест
\``)
  })

  it('test with original plural', async () => {
    const sourceMock = `i18n(value, 'original test || original tests')`

    const result = await loader(sourceMock, options())

    const plurals = {
      1: 'original test',
      2: 'original tests',
    }

    Object.entries(plurals).forEach(([value, text]) =>
      expect(eval(result)).toEqual(text))
  })

  it('test with russian plural', async () => {
    const sourceMock = `i18n(value, 'yaml test || yaml tests')`

    const result = await loader(sourceMock, options())

    const plurals = {
      1: 'yaml тест',
      2: 'yaml теста',
      5: 'yaml тестов',
    }

    Object.entries(plurals).forEach(([value, text]) =>
      expect(eval(result)).toEqual(text))
  })

  it('test with russian plural with context', async () => {
    const sourceMock = `this.context.i18n(value, 'yaml test || yaml tests')`

    const result = await loader(sourceMock, options())

    const plurals = {
      1: 'yaml тест',
      2: 'yaml теста',
      5: 'yaml тестов',
    }

    Object.entries(plurals).forEach(([value, text]) =>
      expect(eval(result)).toEqual(text))
  })

  describe('test plural syntax parser', () => {
    const sourceMocks = [
      `i18n(value,'original test||original tests')`,
      `i18n(  value,  'original test||original tests'  )`,
      `i18n(value, 'original test  ||  original tests')`,
      `i18n(value, "original test || original tests")`,
      `i18n(value, "original test || original tests")`,
      'i18n(value, `original test || original tests`)',
      `i18n(
        value,
        'original test || original tests'
      )`,
    ]

    const plurals = {
      1: 'original test',
      2: 'original tests',
    }

    sourceMocks.forEach((mock) => {
      it(`test with: ${mock}`, async () => {
        const result = await loader(mock, options())

        Object.entries(plurals).forEach(([value, text]) =>
          expect(eval(result)).toEqual(text))
      })
    })
  })

  it('test plural parser unknown language error', async () => {
    const lang = 'test_lang'
    const defaultLang = 'test_default_lang'

    const sourceMock = `i18n(value, 'original test || original tests')`

    const error = `module-i18n loader error for in '${sourceMock}'. There are no plural forms or custom methods for: ${JSON.stringify({
      lang,
    })}`

    try {
      await loader(sourceMock, options({ i18n: { lang, defaultLang } }))
    } catch ({ message }) {
      expect(message).toEqual(error)
    }
  })

  it('test plural parser arity error', async () => {
    const sourceMock = `i18n(value, 'yaml plural error test || yaml plural error tests')`

    const error = `module-i18n loader error for in '${sourceMock}'. Different arity for plural forms: ${JSON.stringify({
      lang: 'ru',
      arity: 3,
      plural: 'n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2',
    })}`

    try {
      await loader(sourceMock, options())
    } catch ({ message }) {
      expect(message).toEqual(error)
    }
  })

  it('test i18n combination', async () => {
    const sourceMock = "i18n`You have ${value} new ${i18n(value, 'notification || notifications')} from mailbox`"

    const result = await loader(sourceMock, options())

    const plurals = {
      1: 'У вас есть 1 новое уведомление из почты',
      2: 'У вас есть 2 новых уведомления из почты',
      5: 'У вас есть 5 новых уведомлений из почты',
    }

    Object.entries(plurals).forEach(([value, text]) =>
      expect(eval(result)).toEqual(text))
  })

  it('test i18n combination with the shorthand', async () => {
    const sourceMock = "i18n`shorthand // You have ${value} new ${i18n(value, 'notification || notifications')} from mailbox`"

    const result = await loader(sourceMock, options())

    const plurals = {
      1: 'У вас есть 1 новое уведомление из почты',
      2: 'У вас есть 2 новых уведомления из почты',
      5: 'У вас есть 5 новых уведомлений из почты',
    }

    Object.entries(plurals).forEach(([value, text]) =>
      expect(eval(result)).toEqual(text))
  })

  it('test i18n method', async () => {
    const sourceMock = 'i18n.testMethod();i18n.testKey'

    const result = await loader(sourceMock, options())

    expect(result).toEqual(`const i18n_methods = {"testMethod":() => 'это тестовый метод',"testKey":"тестовый ключ"};\ni18n_methods.testMethod();i18n_methods.testKey`)
  })
})
