# Contributing

Any contribution is most welcome! Feel free to submit pull requests,
explaining what change you made & why.

## Development Environment

To get set up:

  * `npm install -g grunt-cli` to get [Grunt](http://gruntjs.com/).
  * `npm install` to install development dependencies.
  * `./node_modules/.bin/bower install` to install bower libraries for unit tests.
  * `grunt` will build the files in `dist`, ready to be deployed;
    or, `grunt dev` will watch your files and recompile on changes.

The last solution is useful for development. You can open your browser at
[localhost:8000](http://localhost:8000/), play with the example and see your
changes along the way.

The chart itself is written in [CoffeeScript](http://coffeescript.org/), but is
always distributed as JavaScript. Sources are `lower-case-dashed.foo`, 4-space
indented and try to wrap at 80 columns.

## Pushing a New Release

Unlike many other projects, the compiled versions of d3.chart.bubble-matrix are not committed to this git repo, and are instead comitted to [d3.chart.bubble-matrix.shim)](https://github.com/benbria/d3.chart.bubble-matrix.shim).
