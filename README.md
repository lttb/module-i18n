# Module i18n

## Features
* use **local** dictionaries for each module
* pluralisation
* concise syntax
* inline translation for language support - so you don't need to load a dictionary on the client, it's done in the bundle. As a bonus - no runtime functions, minimum costs
* runtime and static inlined translation with common syntax and dictionaries (useful for isomorphic code/server render for example)
* supports global dictionary
* fallback to global dictionary or default language
* translation combinations
* independent of the technology stack (not only as webpack-loader)
* YAML / JSON

I think that it's useful to build a separate bundle for language. There are some advantages, in my opinion:
- Your bundle has nothing extra dependencies for i18n, only translated text and plural expressions
- You can also use some language-specific functions in the separate bundle (I'll detail below)
- Efficient, no runtime function/components creation
- You have an availability to upgrade only certain language bundle, and other language bundles will continue to be stored in cache 

> Note, that this project has unstable experimental status, so I'll be glad for feedback.

## Usage

### Installation

```sh
$ npm i -S module-i18n
```

### Syntax

- Inline text: 
```js
i18n`Translate me please`
```
- Inline text with variable (*syntax for only static loader*)
```js
i18n`Translate me please ${userName}`
```
- Inline text with variable for **runtime and static usage**
```js
i18n`Translate me please ${{ userName }}`
```
- Inline pluralisation, where `'man || men'` - is a key in a dictionary:
```js
i18n(value, 'man || men')
```
- Inline pluralisation shorthand:
```js
i18n(value, 'замок || замка || замков', 'ru')
```
- Inline text with inline pluralisation (combo):
```js
// so the variable for pluralization will be matched with variable in sentence by name
i18n`Translate me please ${'times, "time || times"'} ${{ times }}`

// you can also pass a custom variable for pluralization
i18n`Translate me please ${`${realTimes}, 'time || times'`} ${{ times }}`
```
- Custom method for language (i.e. that exports from module's ru.js)
```js
i18m.customMethod()
```
- Custom key for language (i.e. that exports from module's ru.js)
```js
i18m.customKey
```

### Example

You can check a [counter example with server side rendering](https://github.com/lttb/module-i18n/tree/master/examples/counter) or [tests](https://github.com/lttb/module-i18n/tree/master/src/tests) for more details.

Imagine we have this file structure:
* src
    - components
        + MessagesText
            * index.jsx

And a component we want for russian i18n:

```jsx
const MessagesText = ({ name, count }) => (
    <p>{'Hello ${name}, you have ${count} new messages'}</p>
)
```

With **module i18n loader** it became as:
* MessagesText
    - index.jsx
    - i18n
        + ru.yaml


**Component**:
```jsx
const MessagesText = ({ name, count }) => (
    <p>
        {i18n`Hello ${name}, you have ${count} new ${'count, "message || messages")'}`}
    </p>
)
```

**components/MessagesText/i18n/ru.yaml**
```yaml
# shorthand example

Hello ${name}, you have ${count} new ${'count, "message || messages")'}:
    Привет, ${name}, у тебя есть ${count} ${i18n(count, 'новое сообщение || новых сообщения || новых сообщений', 'ru')}
```

```yaml
# full example, with plural keys

Hello ${name}, you have ${count} new ${'count, "message || messages")'}:
  Привет, ${name}, у тебя есть ${count} ${i18n(count, 'new message || new messages')}

new message || new messages:
  - новое сообщение
  - новых сообщения
  - новых сообщений
```    

And that's all :) After loader that string becomes something like:
```js
`Привет, ${name}, у тебя есть ${count} ${(count%10==1 && count%100!=11 ? 'новое сообщение' : count%10>=2 && count%10<=4 && (count%100<10 || count%100>=20) ? 'новых сообщения' : 'новых сообщений')}`
```

### Tips
#### webpack
Languages building example (*webpack.config.js*):
```js
module.exports = ['ru', 'en'].map(lang => ({
    ...
    module: {
        rules: [
            {
                test: /(\.js|\.jsx)$/,
                include: [
                  PATHS.app,
                ],
                use: [
                    {
                        /* use module i18n loader for inline translations */
                        loader: 'module-i18n/lib/loader/webpack',
                        query: {
                            lang,
                            namespace: 'i18n',
                            defaultLang: 'en',
                        }
                    },
                ],
            },
        ],
    }
}))
```
