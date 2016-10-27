# [@raider/which](https://npmjs.com/package/@raider/which)

**fast cross-platform 'which' utility with API and CLI support.**

[![NPM](https://nodei.co/npm/which.png?stars=true&downloads=true)](https://nodei.co/npm/which/)

## CLI

```bash
npm i -g @raider/which@latest

which node
# C:\Program Files\nodejs\node.exe

which npm
# C:\Users\raider\local\npm\npm

which yarn
# C:\Users\raider\local\npm\yarn
```

## API

```js
import which from '@raider/which'

which('node', (path) => {
  if(result)
    console.log(path)
})
```

**omit the callback to return a promise**

```js
which('npm').then((path) => {
  if(path) {
    // process
  }
})
```

**async / await**

```js
(async function () {
  const path = await which('yarn')
  if(path) {
    // process
  }
})
```


`@raider/which` is tested and made to work cross-platform.
