#!/bin/sh

npm version minor
git push origin v$(node release/package-version.js)