#!/bin/bash

source ./release/log.sh

# check that there are no current changes

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