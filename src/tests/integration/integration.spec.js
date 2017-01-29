import path from 'path'

import { I18ns } from '../../runtime'
import loader from '../../loader'
import int from './module'


const options = ({ i18n, dict } = {}) => ({
  get i18n() {
    return Object.assign({
      lang: 'ru',
    }, i18n)
  },

  get dict() {
    return Object.assign({
      dependency: jest.fn(),
      resource: path.resolve(__dirname, 'module', 'index.js'),
    }, dict)
  },
})

describe('Integration i18n', () => {
  it('test runtime', async () => {
    const i18n = (await I18ns()).ru

    expect(int(i18n)).toEqual({
      clause: 'это тестовое сообщение',
      plural: 'сообщений',
      value: 'Всего сообщений: 5',
      valueCodestyle: 'Всего сообщений в другом стиле: 5',
      valueDifferentCodestyle: 'Всего сообщений в другом стиле: 5',
      combo: 'У вас 5 новых сообщений',
      customMethod: 'Форматирование',
      customKey: 'кастомный ключ',
    })
  })

  it('test loader', async () => {
    const result = await loader(`(${int.toString()})()`, options())

    expect(eval(result)).toEqual({
      clause: 'это тестовое сообщение',
      plural: 'сообщений',
      value: 'Всего сообщений: 5',
      valueCodestyle: 'Всего сообщений в другом стиле: 5',
      valueDifferentCodestyle: 'Всего сообщений в другом стиле: 5',
      combo: 'У вас 5 новых сообщений',
      customMethod: 'Форматирование',
      customKey: 'кастомный ключ',
    })
  })
})
