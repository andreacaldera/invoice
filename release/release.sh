#!/bin/sh

RELEASE_BRANCH=$(git branch | grep \\* | cut -d " " -f2)
echo "=== RELEASING $RELEASE_BRANCH ==="

git checkout master && git pull
git merge $RELEASE_BRANCH
if [ $? -nq 0 ]; then
  echo "Merged fails, please fix all conflicts manually before releasing"  
  exit 1
fi

git push

echo "Updating Jenkinsfile"
TARGET_BRANCH="master" node release/update-jenkinsfile.js
git commit -am "Restore jenkinsfile with master"
git push