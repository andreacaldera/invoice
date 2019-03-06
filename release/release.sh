#!/bin/sh

RELEASE_BRANCH=$(git branch | grep \\* | cut -d " " -f2)
echo "=== RELEASING $RELEASE_BRANCH ==="

git checkout master && git pull
git merge $RELEASE_BRANCH
if [ $? -ne 0 ]; then
  echo "\nMerged fails, please fix all conflicts manually before releasing\n"  
  exit 1
fi

git push

echo "\nUpdating Jenkinsfile\n"
TARGET_BRANCH="master" node release/update-jenkinsfile.js
git commit -am "Restore jenkinsfile with master"
git push

echo "\nRelease completed successfully\n"