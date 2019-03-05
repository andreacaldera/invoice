#!/bin/sh

npm version minor
git push origin $(node release/package-version.js)