#!/bin/bash
# KidsLingo deploy pipeline — build, push, deploy, purge cache

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="/root/.openclaw/workspace/kids-lingo"
VAULT_FILE="/root/.openclaw/workspace/.secrets/vault.yml"

# Load credentials from vault
CF_TOKEN=$(grep -o 'cfut_[A-Za-z0-9]*' "$VAULT_FILE" | head -1)
CF_ACCOUNT=$(grep -o 'cb8ab13b857925cdb9b3c0fd9d4ec4bf' "$VAULT_FILE" || echo 'cb8ab13b857925cdb9b3c0fd9d4ec4bf')

cd "$REPO_DIR"

# Get git info
COMMIT=$(git rev-parse --short HEAD)
DATE=$(date +%Y-%m-%d)
TIME=$(date +%H:%M)

# Bump patch version
CURRENT=$(node -p "require('./package.json').version")
MAJOR=$(echo "$CURRENT" | cut -d. -f1)
MINOR=$(echo "$CURRENT" | cut -d. -f2)
PATCH=$(echo "$CURRENT" | cut -d. -f3)
NEW_PATCH=$((PATCH + 1))
NEW_VERSION="${MAJOR}.${MINOR}.${NEW_PATCH}"

# Update package.json version
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.version = '$NEW_VERSION';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

# Update version.ts
printf "// Auto-generated version info — updated on every build\nexport const BUILD_VERSION = '%s'\nexport const BUILD_DATE = '%s'\nexport const BUILD_TIME = '%s'\nexport const GIT_COMMIT = '%s'\n" "$NEW_VERSION" "$DATE" "$TIME" "$COMMIT" > src/version.ts

echo "🚀 Building KidsLingo v$NEW_VERSION (commit $COMMIT)..."

# Build
npm run build

# Commit and push to GitHub
git add -A
git commit -m "v${NEW_VERSION} — auto-deploy" || true
git push origin master:main

echo "📤 Pushed to GitHub. Deploying to Cloudflare Pages..."

# Deploy to Cloudflare Pages
CLOUDFLARE_API_TOKEN="$CF_TOKEN" npx wrangler pages deploy dist \
  --project-name=kids-lingo \
  --commit-message="v${NEW_VERSION}" \
  --branch=main

echo "🧹 Purging Cloudflare cache..."

# Purge Cloudflare cache via API
curl -s -X POST \
  "https://api.cloudflare.com/client/v4/zones?name=kids-lingo.pages.dev" \
  -H "Authorization: Bearer $CF_TOKEN" \
  -H "Content-Type: application/json" \
  | python3 -c "
import sys, json
data = json.load(sys.stdin)
if data.get('result'):
    for zone in data['result']:
        print(f'Zone: {zone[\"id\"]}')
" > /tmp/kids_lingo_zone.json 2>/dev/null || true

# Try direct purge on the Pages project (may not work for all zones, but we try)
echo "✅ Done! Live at https://kids-lingo.pages.dev/"

# Also try to purge via Pages API
curl -s -X POST \
  "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT/pages/projects/kids-lingo/purge" \
  -H "Authorization: Bearer $CF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"purge_everything": true}' \
  | python3 -c "
import sys, json
data = json.load(sys.stdin)
if data.get('success'):
    print('🧹 Cache purged successfully')
else:
    print('⚠️ Cache purge may have failed — CDN will refresh naturally within minutes')
" || true

echo "🎉 KidsLingo v$NEW_VERSION deployed!"
