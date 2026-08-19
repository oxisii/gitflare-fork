#!/usr/bin/env bash
# Sync oxisii/gitflare from the official Gitflare repo.
# Usage: ./scripts/sync-upstream.sh
set -euo pipefail
cd "$(dirname "$0")/.."
git remote get-url upstream >/dev/null 2>&1 || \
  git remote add upstream https://github.com/mdhruvil/gitflare.git
git remote set-url upstream https://github.com/mdhruvil/gitflare.git
git fetch upstream
echo "upstream/main = $(git rev-parse --short upstream/main)"
echo "HEAD          = $(git rev-parse --short HEAD)"
echo
echo "Review, then merge:"
echo "  git merge upstream/main"
echo "Resolve i18n / oxisii deploy conflicts before pushing origin."
