This project was bootstrapped with [@raider/modular](https://github.com/noderaider/modular).

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/noderaider/modular/blob/master/packages/bin-utils/template/create-express-modules/README.md).

## Updating to New Releases

Create express Module is divided into two packages:

* `create-express-module` is a global command-line utility that you use to create new projects.
* `bin-utils` is a development dependency in the generated projects (including this one).

You almost never need to update `create-express-module` itself: it delegates all the setup to `bin-utils`.

When you run `create-express-module`, it always creates the project with the latest version of `bin-utils` so you’ll get all the new features and improvements in newly created modules automatically.

To update an existing project to a new version of `bin-utils`, [open the changelog](https://github.com/noderaider/modular/blob/master/CHANGELOG.md), find the version you’re currently on (check `package.json` in this folder if you’re not sure), and apply the migration instructions for the newer versions.

In most cases bumping the `bin-utils` version in `package.json` and running `npm install` OR `yarn` in this folder should be enough, but it’s good to consult the [changelog](https://github.com/noderaider/modular/blob/master/CHANGELOG.md) for potential breaking changes.

I commit to continually publishing so hold on for the ride!

## Sending Feedback

I am always open to [your feedback](https://github.com/noderaider/modular/issues).

## Folder Structure

After creation, your project should look like this:

```
my-module/
  .gitignore
  .npmignore
  README.md
  node_modules/
  package.json
  src/
    lib/
      index.js
      styles.express <= This is where your express module styles go
    webpack/
      ...
```

For the project to build, **these files must exist with exact filenames**:

* `src/lib/index.js` is the JavaScript entry point.
* `src/lib/index.express` is the express Module.
* `src/lib/webpack` is the files used to compile the webpack.config. It is included so that you may experiment with webpack options.

You may create subdirectories inside `src`. For faster rebuilds, only files inside `src` are processed by Webpack.<br>
You need to **put any JS and express files inside `src`**, or Webpack won’t see them.

Only files inside `public` can be used from `public/index.html`.<br>
Read instructions below for using assets from JavaScript and HTML.

You can, however, create more top-level directories.<br>
They will not be included in the production build so you can use them for things like documentation.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the module in hot rebuild mode. If developing in a linked setting, you should run this prior to your hot reloading command in the downstream app.

### `npm test`

Nothing to test here.

### `npm run build`

Builds the module to the lib folder (for publishing).

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle expressments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Something Missing?

If you have ideas for more “How To” recipes that should be on this page, [let us know](https://github.com/facebookincubator/create-react-app/issues) or [contribute some!](https://github.com/facebookincubator/create-react-app/edit/master/packages/react-scripts/template/README.md)
