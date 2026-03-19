#!/bin/bash
set -e

echo "Building client..."
cd client && npm run build && cd ..

echo "Staging dist..."
git add client/dist -f

echo "Committing and pushing..."
git add -A
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M')" || echo "Nothing to commit"
git push

echo "Done. DO will pick up the new build."
