import express from 'express'
import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import { renderToString } from 'react-dom/server'

import { I18ns } from 'module-i18n'

import I18nProvider from 'module-i18n/lib/provider'
import rootReducer from '../client/reducers'
import App from '../client/containers/App'


const app = express()
const port = 3000

I18ns().then((I18n) => {
  const renderFullPage = ({ html, state, lang }) =>
    `
      <!doctype html>
      <html>
        <head>
          <title>Counter i18n server render example | ${lang}</title>
          <link rel="stylesheet" href="/static/${lang}.css">
        </head>
        <body>
          <div id="app">${html}</div>
          <script>
            window.PRELOADED_STATE = ${JSON.stringify(state)}
          </script>
          <script src="/static/${lang}.js"></script>
        </body>
      </html>
    `

  const handleRender = ({ query, params }, res) => {
    const { counter } = query
    const { lang = 'en' } = params

    const i18n = I18n[lang]

    if (!i18n) {
      res.status(400).send('Unsupported language')

      return
    }

    const store = createStore(rootReducer, { counter: Number(counter) || 0 })

    const html = renderToString(
      <Provider store={store}>
        <I18nProvider i18n={i18n}>
          <App />
        </I18nProvider>
      </Provider>,
    )

    res.send(renderFullPage({ html, lang, state: store.getState() }))
  }

  app.use('/static', express.static('dist'))
  app.use('/:lang?/?$', handleRender)

  app.listen(port, () => console.log(`listening on port ${port}`))
})

