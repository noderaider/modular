# [@raider/cross](https://npmjs.com/package/@raider/cross)

**Upgrade a repo / package to use unix style line endings (works on all platforms).**

[![NPM](https://nodei.co/npm/cross.png?stars=true&downloads=true)](https://nodei.co/npm/cross/)

## CLI

```bash
npm i -g @raider/cross@latest

cross [repo/path]
```

<sup>@raider/cross will prompt user for confirmation before doing anything.</sup>

## package.json

```json
{ "scripts": {
    "prepublish": "cross"
  },
  "devDependencies": {
    "@raider/cross": "latest"
  }
}
```

## API

```js
import cross from '@raider/cross'

cross(process.cwd(), (err) => {
  if(err)
    console.error(err)
})
```

**omit the callback to return a promise**

```js
cross(__dirname)
  .then(() => console.log('DONE'))
  .catch((err) => console.error(err))
```

**async / await**

```js
(async function () {
  try {
    await cross(undefined) // defaults to process.cwd()
    console.log('DONE')
  } catch (err) {
    console.error(err)
  }
})
```


`@raider/cross` is tested and made to work cross-platform.
