# Contributing

Any contribution is most welcome! Feel free to submit pull requests,
explaining what change you made & why.

## Development Environment

You need [Grunt](http://gruntjs.com/) to develop (`npm install -g grunt-cli`).
Run `npm install` to get the necessary packages, then:

  * `grunt` will build the files in `dist`, ready to be deployed;
  * or, `grunt dev` will watch your files and recompile on changes.

The last solution is useful for development. You can open your browser at
[localhost:8000](http://localhost:8000/), play with the example and see your
changes along the way.

The chart itself is written in [LiveScript](http://livescript.net/), pretty
similar to CoffeeScript.

Sources are `lower-case-dashed.foo`, 4-space indented and try to wrap
at 80 columns.
