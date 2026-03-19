#!/bin/bash
# Push to GitHub using GITHUB_TOKEN (HTTPS) - run from Shell tab

if [ -z "$GITHUB_TOKEN" ]; then
  echo "[git-push] GITHUB_TOKEN not set"
  exit 1
fi

git remote set-url origin "https://duman080896-alt:${GITHUB_TOKEN}@github.com/duman080896-alt/zero-print.git"
git push origin main
echo "[git-push] Done"
