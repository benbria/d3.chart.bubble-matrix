# Contributing

Any contribution is most welcome! Feel free to submit pull requests,
explaining what change you made & why.

## Development Environment

You need to install `grunt-cli` to develop, generally globally. Then run
`npm install` to get the necessary packages, then:

  * `grunt` will build the files in `dist`, ready to be deployed;
  * or, `grunt dev` will watch your files and recompile on changes.

The last solution is useful for development. You can open your browser at
[localhost:8000](http://localhost:8000/), play with the example and see your
changes along the way.

The chart itself is written in [LiveScript](http://livescript.net/), pretty
similar to CoffeeScript.

## Style Guide

  * All files are `lower-case-dashed.foo`;
  * 4-space indentation;
  * 80 columns max.
