#!/bin/sh

RELEASE_BRANCH=$(git branch | grep \\* | cut -d " " -f2)
echo "=== RELEASING $RELEASE_BRANCH ==="

git checkout master && git pull
git merge $RELEASE_BRANCH
git push

echo "Updating Jenkinsfile"
TARGET_BRANCH="master" node release/update-jenkinsfile.js
git commit -am "Restore jenkinsfile with master"
git push