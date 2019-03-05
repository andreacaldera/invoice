#!/bin/sh

# check that there are no current changes

NEW_VERSION=$(node release/get-new-version.js)
RELEASE_BRANCH=v$NEW_VERSION

TARGET_BRANCH=$RELEASE_BRANCH node release/update-jenkinsfile.js

git commit -m "pre-release steps for $NEW_VERSION: jenkinsfile"

git checkout -b $RELEASE_BRANCH

npm version NEW_VERSION -no-git-tag-version

git commit -m "pre-release steps for $NEW_VERSION: package version"

git push origin $RELEASE_BRANCH


