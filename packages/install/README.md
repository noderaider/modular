# [@raider/install](https://npmjs.com/package/@raider/install)

**fast cross-platform 'install' utility with API and CLI support. Autodetects npm client installer (npm or yarn for now) and installs with best option.**

[![NPM](https://nodei.co/npm/install.png?stars=true&downloads=true)](https://nodei.co/npm/install/)

## CLI

```bash
npm i -g @raider/install@latest

install

# for usage instructions:
install -h
```

## API

```js
import install from '@raider/install'

// Options can be passed to force installation using npm or yarn, if omitted, they will be autodetected on the system (yarn takes precedence).
install({ npm: false, yarn: false, verbose: false }, () => {
  console.log('done installing')
})
```

**omit the callback to return a promise**

```js
install({}).then(() => {
  // continue
})
```

**async / await**

```js
(async function () {
  await install()
  // continue
})
```

`@raider/install` is tested and made to work cross-platform.
