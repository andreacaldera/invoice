#!/bin/bash

source ./release/log.sh

git status | grep 'nothing to commit'
if [ $? -ne 0 ]; then
  log "Working directory is not clean, please commit or stash your changes"
  exit 1
fi

NEW_VERSION=$(TYPE=minor node release/get-new-version.js)
RELEASE_BRANCH=v$NEW_VERSION

log "Preparing release $NEW_VERSION $RELEASE_BRANCH"

log "Updating Jenkinsfile"
TARGET_BRANCH=$RELEASE_BRANCH node release/update-jenkinsfile.js
git commit -am "Release $NEW_VERSION: jenkinsfile"
git push

log "Preparing release branch"
git checkout -b $RELEASE_BRANCH
npm version $NEW_VERSION -no-git-tag-version
git commit -am "Release $NEW_VERSION: update package version"
git push origin $RELEASE_BRANCH

log "Release branch $RELEASE_BRANCH pushed"

log "Release preparation completed"