#!/bin/bash
set -e

# Step 1: Clean old build artifacts
echo "Cleaning old build artifacts..."
rm -rf docs demo/dist

# Step 2: Build the demo app
echo "Building the demo app..."
cd demo
npm run build
cd ..

# Step 3: Copy build output to docs/
echo "Copying build output to docs/..."
cp -R demo/dist/* docs/

# Step 4: Commit and push changes
echo "Committing and pushing to GitHub..."
git add docs
if git diff --cached --quiet; then
  echo "No changes to commit."
else
  git commit -m "chore: deploy demo app to GitHub Pages"
  git push
fi

echo "Deployment complete!" 