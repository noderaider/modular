# [@raider/modular](https://npmjs.com/package/@raider/modular)

**An unofficial companion ecosystem to [`create-react-app`](https://npmjs.com/package/create-react-app)**

[![Build Status](https://travis-ci.org/noderaider/modular.svg?branch=master)](https://travis-ci.org/noderaider/modular)
[![codecov](https://codecov.io/gh/noderaider/modular/branch/master/graph/badge.svg)](https://codecov.io/gh/noderaider/modular)

### What is this?

Often react applications can grow extremely large. `create-react-app` is a very innovative step forward in react apps, encouraging keeping them small by abstracting the build into a separate module (`react-scripts`). This 'managed' build strategy has many upsides, with the primary drawback being that you cannot modify the build process as easily. `@raider/modular` is an ecosystem of companion tools to `create-react-app` to continue in its footsteps, targeting the areas that it does not hit such as CSS modules support, and doing it in such a way that it will encourage project stacks to grow horizontally (many modules) instead of vertically.

### Tenets

* Every module is its own npm package.
* Every module has built in hot reloading support to work in conjunction with a `create-react-app` downstream project.
* Fast yarn installation support with fallback to npm if yarn is not installed.
* Works on every platform.

### PROGRESS


- [x] [`npm i -g create-css-module`](https://npmjs.com/package/create-css-module) [:scroll:](https://github.com/noderaider/modular/tree/master/packages/create-css-module)
  - create a hot reloading CSS modules library.
- [x] [`npm i -g create-umd-module`](https://npmjs.com/package/create-umd-module) [:scroll:](https://github.com/noderaider/modular/tree/master/packages/create-umd-module)
  - create a lightweight ES2015 module with rollupjs and tree shaking.
  - hot reloads with simple babel watch.
  - good for generic universal libraries (non-React)
- [x] [`npm i -g create-cli-module`](https://npmjs.com/package/create-cli-module)  [:scroll:](https://github.com/noderaider/modular/tree/master/packages/create-cli-module)
  - create a server module meant to be called from CLI / API.
- [x] [`npm i -g create-sass-module`](https://npmjs.com/package/create-sass-module) [:scroll:](https://github.com/noderaider/modular/tree/master/packages/create-sass-module)
  - create a hot reloading sass library.
- [x] [`npm i -g create-component-module`](https://npmjs.com/package/create-component-module) [:scroll:](https://github.com/noderaider/modular/tree/master/packages/create-component-module)
  - create a hot reloading React component module.
  - No `react` / `react-dom` dependencies, components are created functionally via a factory interface:

```bash
create-component-module react-foo-bar [-t/--with-test-module]
```

**After publishing / linking, you may use the component from your downstream react app like so:**

```js
import React from 'react'
import reactFooBar from 'react-foo-bar'

// Create the component
const FooBar = reactFooBar(React)

export default (props) => <FooBar foo="bar" />
```

<sup>Note: Exporting modules as factories sidesteps a wide range of issues causing multiple instances of React in your downstream app.</sup>

- [ ] [`npm i -g create-jest-module`](https://npmjs.com/package/create-jest-module) [:scroll:](https://github.com/noderaider/modular/tree/master/packages/create-jest-module)
  - create a standalone jest test module capable of end-to-end testing another module.
  - IMO it is better to unit test components (react ones particularly) from a separate module. No longer must `react` / `react-dom` be included as npm dependencies of your module.
- [ ] [`npm i -g create-express-module`](https://npmjs.com/package/create-express-module) [:scroll:](https://github.com/noderaider/modular/tree/master/packages/create-express-module)
  - create an express server module.
- [ ] [`npm i -g create-koa-module`](https://npmjs.com/package/create-koa-module) [:scroll:](https://github.com/noderaider/modular/tree/master/packages/create-koa-module)
  - create a koa server module.
- [ ] [`npm i -g create-proxy-module`](https://npmjs.com/package/create-proxy-module) [:scroll:](https://github.com/noderaider/modular/tree/master/packages/create-proxy-module)
  - create a reverse proxy.
- [ ] [`npm i -g create-deploy-module`](https://npmjs.com/package/create-deploy-module) [:scroll:](https://github.com/noderaider/modular/tree/master/packages/create-deploy-module)
  - create a server deployment module.
- [ ] [`npm i -g create-react-repo`](https://npmjs.com/package/create-react-repo) [:scroll:](https://github.com/noderaider/modular/tree/master/packages/create-react-repo)
  - create a lerna monorepo with all modular commands (and create-react-app) integrated.

## Utils

- [x] [`npm i -g @raider/install`](https://npmjs.com/package/@raider/install) [:scroll:](https://github.com/noderaider/modular/tree/master/packages/install)
  - CLI / API component to run NPM install on a package.
  - Uses yarn if detected and falls back to npm.
- [x] [`npm i -g @raider/which`](https://npmjs.com/package/@raider/which) [:scroll:](https://github.com/noderaider/modular/tree/master/packages/which)
  - CLI / API component to run closs-platform `which` command.
- [x] [`npm i -g @raider/cross`](https://npmjs.com/package/@raider/cross) [:scroll:](https://github.com/noderaider/modular/tree/master/packages/cross)
  - CLI / API component to upgrade a project / repos line endings to unix style safely and recursively.

### Acknowledgements

Special thanks to Facebook for innovations with `create-react-app`, without it this project would not be possible.
