#!/bin/bash

source $(dirname $0)/log.sh

RELEASE_BRANCH=$(git branch | grep \\* | cut -d " " -f2)
log "Releasing $RELEASE_BRANCH"

log "Tagging release $RELEASE_BRANCH"
git tag -a $RELEASE_BRANCH -m "Tagging $RELEASE_BRANCH"
git push origin $RELEASE_BRANCH
log "Version tagged as $RELEASE_BRANCH"

git checkout master && git pull
git merge $RELEASE_BRANCH
if [ $? -ne 0 ]; then
  log "Merged fails, please fix all conflicts manually before releasing"  
  exit 1
fi

git push

log "Updating Jenkinsfile"
TARGET_BRANCH="master" node release/update-jenkinsfile.js
git commit -am "Restore jenkinsfile with master"
git push

log "Removing release branch $RELEASE_BRANCH"
git push origin --delete $RELEASE_BRANCH
log "Release branch $RELEASE_BRANCH removed"

log "Release completed successfully"