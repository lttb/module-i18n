# module i18n example

Install dependencies and start webpack-dev-server. The server will be started with default language (English)

```sh
$ npm i
$ npm start
```

## Custom language

To start webpack-dev-server with custom language, run with this command (i.e. for Russian):
```sh
$ npm start -lang:ru
```

## Start server with server render (with babel-node)

```sh
$ npm run start:server
```

And the server will be enable on `http://localhost:3000/en`

## Build client bundle and server-side lib

```sh
$ npm run build
```

## Start server without babel-node (with builded lib and dist)

```sh
$ node .
```
