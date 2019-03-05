#!/bin/sh

RELEASE_BRANCH=$(git branch | grep \\* | cut -d " " -f2)
echo "=== RELEASING $RELEASE_BRANCH ==="

git checkout master && git pull

git rebase $RELEASE_BRANCH

git push