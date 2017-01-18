# Module i18n

## Features
* use **local** dictionaries for each module
* pluralisation
* concise syntax
* supports global dictionary too, for fallback for example
* translation combinations
* independent of the technology stack (not only as webpack-loader)
* inline translation for language - so you don't need to load a dictionary on the client, it's done in the bundle. As a bonus - no runtime functions, minimum costs
* YAML / JSON

I think that it's useful to build a separate bundle for language. There are some advantages, in my opinion:
- Your bundle has nothing extra dependencies for i18n, only translated text and plural expressions
- You can also use some language-specific functions in the separate bundle (I'll detail below)
- Efficient, no runtime function/components creation
- You have an availability to upgrade only certain language bundle, and other language bundles will continue to be stored in cache 

## Usage

### Syntax

- Inline text: 
```js
i18n`Translate me please`
``` 
- Inline pluralisation:
```js
i18n(value, 'one || two || five')
```
- Inline pluralisation shorthand:
```js
i18n_ru(value, 'замок || замка || замков')
```

The main usage is assumed to be with *webpack* like `loader: 'mi18n/loader'`, but it can be used without.

### Example

Imagine we have this file structure:
* src
    - components
        + MessagesText
            * index.jsx

And a component we want for russian i18n:

```jsx
const MessagesText = ({ name, count }) => (
    <p>
        {'Hello ${name}, you have ${count} new messages '}
    </p>
)
```

With **module i18n loader** it became as:
* src
    - components
        + MessagesText
            * index.jsx
            * i18n
                * ru.yaml

ru.yaml
```yaml
# shorthand example

Hello ${name}, you have ${count} new ${i18n(count, 'message || messages')}:
    Привет, ${name}, у тебя есть ${count} ${i18n_ru(count, 'новое сообщение || новых сообщения || новых сообщений')}
```
```yaml
# full example, with plural keys

Hello ${name}, you have ${count} new ${i18n(count, 'message || messages')}:
  Привет, ${name}, у тебя есть ${count} ${i18n(count, 'new message || new messages')}

new message || new messages:
  - новое сообщение
  - новых сообщения
  - новых сообщений
```    
Component:
```jsx
const MessagesText = ({ name, count }) => (
    <p>
        {i18n`Hello ${name}, you have ${count} new ${i18n(count, 'message || messages')}`}
    </p>
)
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
    resolve: {
        alias: {
            /* it can be useful for language-specific functions import like 'import i18n from 'i18n' from module directory`*/
            i18n: `./i18n/${lang}.js`,
        }
    },
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
                        loader: 'mi18n/loader',
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
#### eslint
You can use this rules for your namespace, for example:
```yaml
globals:
    # for mi18n-loader
    i18n: true
settings:
    # for i18n import
    import/core-modules: [ i18n ]
