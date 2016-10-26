# [@raider/modular](https://npmjs.com/packages/@raider/modular)

**An unofficial companion to [`create-react-app`](https://npmjs.com/packages/create-react-app)**

### What is this?

Often react applications can grow extremely large. `create-react-app` is a very innovative step forward in react apps, encouraging keeping them small by abstracting the build into a separate module (`react-scripts`). This 'managed' build strategy has many upsides, with the primary drawback being that you cannot modify the build process as easily. `@raider/modular` is an ecosystem of companion tools to `create-react-app` to continue in its footsteps, targeting the areas that it does not hit such as CSS modules support, and doing it in such a way that it will encourage project stacks to grow horizontally (many modules) instead of vertically.

### Tenets

* Every module is its own npm package.
* Every module has built in hot reloading support to work in conjunction with a `create-react-app` downstream project.
* Fast yarn installation support with fallback to npm if yarn is not installed.
* Works on every platform.

### PROGRESS

* :heavy_check_mark: `npm i -g create-css-module`
* :heavy_multiplication_x: `npm i -g create-sass-module`
* :heavy_multiplication_x: `npm i -g create-umd-module`
* :heavy_multiplication_x: `npm i -g create-component-module`
* :heavy_multiplication_x: `npm i -g create-express-module`
* :heavy_multiplication_x: `npm i -g create-koa-module`
* :heavy_multiplication_x: `npm i -g create-deploy-module`
* :heavy_multiplication_x: `npm i -g create-cli-module`
* :heavy_multiplication_x: `npm i -g create-react-repo`


### Acknowledgements

Special thanks to Facebook for innovations with `create-react-app`, without it this project would not be possible.
