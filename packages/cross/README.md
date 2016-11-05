# [@raider/cross](https://npmjs.com/package/@raider/cross)

**Upgrade a repo / package to use unix style line endings (works on all platforms).**

[![NPM](https://nodei.co/npm/cross.png?stars=true&downloads=true)](https://nodei.co/npm/cross/)

## CLI

```bash
npm i -g @raider/cross@latest

cross
```

<sup>@raider/cross will prompt user for confirmation before doing anything.</sup>

## API

```js
import cross from '@raider/cross'

cross((err) => {
  if(err)
    console.error(err)
})
```

**omit the callback to return a promise**

```js
cross()
  .then(() => console.log('DONE'))
  .catch((err) => console.error(err))
```

**async / await**

```js
(async function () {
  try {
    await cross()
    console.log('DONE')
  } catch (err) {
    console.error(err)
  }
})
```


`@raider/cross` is tested and made to work cross-platform.
