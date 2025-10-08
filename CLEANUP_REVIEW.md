# 🔍 Final Cleanup Review - Files to Remove for Clean MVP Boilerplate

## ❌ Files/Folders That Should Be Removed

### 1. **Infrastructure Folder** (Feature-Specific Azure Resources)

**Path**: `/infrastructure/*`
**Reason**: Contains Mind Voyage Companion specific Azure Bicep templates, Key Vault configs, and deployment scripts

- `azure-resources.bicep` - App-specific resource definitions (App Service, Key Vault with hardcoded names)
- `KEYVAULT_INTEGRATION_SUMMARY.md` - Feature-specific Key Vault setup
- `KEYVAULT_SETUP_GUIDE.md` - Feature-specific guide
- `parameters.staging.json` / `parameters.production.json` - App-specific parameters
- `deploy.ps1`, `setup-keyvault-secrets.sh`, `setup-secrets.ps1` - Feature-specific scripts
- `README.md` - Infrastructure-specific docs

**Action**: Remove entire `/infrastructure` folder (users will create their own Azure resources)

---

### 2. **Scripts Folder** (Feature-Specific Scripts)

**Path**: `/scripts/*`
**Reason**: All scripts are specific to Mind Voyage Companion project management

- `manage-project.sh` - GitHub project management for this specific repo (PROJECT_ID=4, OWNER="mrbin264")
- `migrate-to-docker-mongodb.sh` - Migration script for this app
- `setup-mongodb.sh` - App-specific MongoDB setup
- `test-auth-mongodb.sh` - Testing script for this app
- `test-docker.sh` - Docker testing for this app
- `verify-tailwind.sh` - Tailwind verification (not needed for boilerplate)

**Action**: Remove entire `/scripts` folder

---

### 3. **E2E Tests** (Feature-Specific Tests)

**Path**: `/e2e/home.spec.ts`
**Reason**: Tests for specific "Mind Voyage Companion" branding and content

```typescript
// Tests for: "Build Better Habits Through Mindful Reflection"
// Tests for: "Mind Voyage Companion" title
```

**Action**: Remove `/e2e/home.spec.ts` - Leave folder structure but add generic placeholder

---

### 4. **Build & Test Artifacts** (Should Not Be Committed)

**Paths**:

- `/data/` - 321MB of MongoDB data (already in .gitignore but committed)
- `/.next/` - 139MB of Next.js build artifacts (already in .gitignore but committed)
- `/playwright-report/` - 456KB of test reports (should not be committed)
- `/test-results/` - 8KB of test results (should not be committed)

**Action**: Git remove these folders (they're in .gitignore for future)

---

### 5. **Temporary Summary File**

**Path**: `/BOILERPLATE_SUMMARY.md`
**Reason**: Created for this PR review, not needed in boilerplate itself

**Action**: Remove after PR is merged (or keep in PR description only)

---

### 6. **Docker MongoDB Config** (May Need Review)

**Path**: `/docker/mongodb/init-mongo.js`
**Reason**: May contain Mind Voyage Companion specific database initialization

**Action**: Review content - if app-specific, simplify or remove

---

### 7. **Missing .gitignore Entries**

**Issue**: Build artifacts are committed but should be ignored

**Action**: Update `.gitignore` to include:

```
# Test artifacts
playwright-report/
test-results/
*.xml

# TypeScript build info
tsconfig.tsbuildinfo
```

---

## ✅ Files to Keep (Essential for Boilerplate)

- ✅ `README.md` - Boilerplate documentation
- ✅ `LOCAL_SETUP.md` - Setup guide
- ✅ `DEPLOYMENT.md` - General deployment guide
- ✅ `/docker/mongodb/mongod.conf` - Generic MongoDB config
- ✅ All source code in `/src`
- ✅ All config files (package.json, tsconfig.json, etc.)
- ✅ `.github/` folder (if it contains generic workflows)

---

## 📊 Cleanup Impact

**Current Size**: ~460MB (with build artifacts)
**After Cleanup**: ~5MB (clean boilerplate)

**Files to Remove**:

- 9 files in `/infrastructure`
- 6 files in `/scripts`
- 1 file in `/e2e`
- 4 folders (data, .next, playwright-report, test-results)
- 1 temp file (BOILERPLATE_SUMMARY.md - optional)

**Total**: ~21 files/folders to remove

---

## 🎯 Recommended Cleanup Commands

```bash
# Remove feature-specific folders
rm -rf infrastructure scripts

# Remove build/test artifacts
rm -rf data .next playwright-report test-results

# Remove feature-specific E2E test
rm e2e/home.spec.ts

# Create placeholder E2E test
cat > e2e/example.spec.ts << 'EOF'
import { test, expect } from '@playwright/test'

test('example test', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/.*/)
})
EOF

# Update .gitignore
cat >> .gitignore << 'EOF'

# Test artifacts
playwright-report/
test-results/
*.xml

# TypeScript build info
tsconfig.tsbuildinfo
EOF

# Optional: Remove summary (after PR merge)
# rm BOILERPLATE_SUMMARY.md
```

---

## ✅ Verification Checklist

After cleanup, verify:

- [ ] No feature-specific infrastructure code
- [ ] No feature-specific scripts
- [ ] No build artifacts committed
- [ ] No test reports committed
- [ ] .gitignore covers all artifacts
- [ ] E2E folder has generic placeholder
- [ ] Total repo size < 10MB
- [ ] All TypeScript compiles
- [ ] Documentation is generic

---

**Status**: Ready to execute cleanup
**Impact**: High (removes ~460MB of unnecessary files)
**Risk**: Low (all removed files are feature-specific or artifacts)
