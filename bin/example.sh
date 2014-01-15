#!/bin/bash
set -e
mkdir -p example/.build
watchify example/example.js -o example/.build/example.js &
stylus src/style src/theme -o example/.build/ --watch &
serve -L example
