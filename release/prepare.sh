#!/bin/bash

source $(dirname $0)/log.sh

git status | grep 'nothing to commit'
if [ $? -ne 0 ]; then
  log "Working directory is not clean, please commit or stash your changes"
  exit 1
fi

VERSION="minor"
COMMIT=""

usage() { 
  log "Usage: $0 [ -v VERSION (minor by default) ] [ -c COMMIT (head by default) ]" 1>&2 
}

exit_abnormal() {
  usage
  exit 1
}

while getopts ":v:c:" options; do              
  case "${options}" in                         
    v)                                         
      VERSION=${OPTARG}                        .
      ;;
    c)                                         
      COMMIT=${OPTARG}                         
      ;;
    :)                                         
      echo "Error: -${OPTARG} requires an argument."
      exit_abnormal  
      ;;
    *)
      exit_abnormal
      ;;
  esac
done

if [ ! -z $COMMIT ]; then
    log "Using commit $COMMIT"
    git checkout $COMMIT    
    if [ $? -ne 0 ]; then
        log "Cannot find commit $COMMIT"
        exit 1
    fi
else 
    COMMIT="HEAD"
fi

NEW_VERSION=$(TYPE=$VERSION node release/get-new-version.js)
RELEASE_BRANCH=v$NEW_VERSION

log "Preparing release $NEW_VERSION $RELEASE_BRANCH"

log "Writing release notes"
LAST_RELEASE=$(git log --pretty=oneline --grep="Merge tag" | head -1 | cut -d' ' -f1)
log "Analysing all commits from $LAST_RELEASE"
printf "$NEW_VERSION release notes\n" >> release-notes.txt
git rev-list $LAST_RELEASE..HEAD --pretty=%s | grep -v "^commit" | cut -d' ' -f1 | grep "^CSIXREV-" | uniq >> release-notes.txt
printf "\n\n" >> release-notes.txt

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