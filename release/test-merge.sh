git merge v0.33.0
if [ $? -ne 0 ]; then
  echo "\nMerged fails, please fix all conflicts manually before releasing\n"  
  exit 1
fi

echo 'SHOULD NOT SEE THIS'
