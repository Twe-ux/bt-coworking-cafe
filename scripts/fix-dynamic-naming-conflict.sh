#!/bin/bash

# Fix naming conflict between 'import dynamic from next/dynamic'
# and 'export const dynamic = force-dynamic'

# Find all files with the conflict
FILES=$(grep -r "import dynamic from 'next/dynamic'" src/app/dashboard/ --files-with-matches)

for file in $FILES; do
  echo "Fixing $file..."

  # Replace import statement
  sed -i "s/import dynamic from 'next\/dynamic'/import dynamicImport from 'next\/dynamic'/g" "$file"

  # Replace usages of dynamic( with dynamicImport(
  # But NOT export const dynamic =
  sed -i "s/const \([A-Za-z0-9]*\) = dynamic(/const \1 = dynamicImport(/g" "$file"
done

echo "Fixed ${#FILES[@]} files"
