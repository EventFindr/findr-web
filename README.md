# findr-web
Web Client for Findr

## Build instructions

First install dependencies:

    npm install

Then build with:

    rm dist/*
    browserify "src/main.jsx" -t babelify --outfile "dist/bundle.js"
    cp static/index.html dist

And run the build with:

    cd dist
    python3 -m http.server

...or your preferred method of setting up a static web server.

A makefile will be provided in the future.
