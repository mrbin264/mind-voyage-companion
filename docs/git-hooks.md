# Git Hooks Configuration

This project uses automated git hooks to maintain code quality and prevent broken code from being committed or pushed.

## Hooks Overview

### 🔍 Pre-commit Hook (`.husky/pre-commit`)

Runs before every commit to ensure code quality:

- **Lint-staged**: Runs ESLint and Prettier on staged files only
- **Unit Tests**: Runs all unit tests to catch breaking changes
- **Type Check**: Validates TypeScript types

**What it prevents:**

- Committing code with linting errors
- Committing code with formatting issues
- Committing code that breaks existing functionality

### 🚀 Pre-push Hook (`.husky/pre-push`)

Runs before pushing to remote repository with different levels based on branch:

**For `main` and `develop` branches (Full validation):**

- Type checking
- Unit tests
- E2E tests (Playwright)

**For feature branches (Quick validation):**

- Type checking
- Unit tests only

**What it prevents:**

- Pushing broken code to critical branches
- Deploying untested features
- Breaking the CI/CD pipeline

### 📝 Commit Message Hook (`.husky/commit-msg`)

Validates commit messages follow conventional commits format:

**Required format:** `<type>[optional scope]: <description>`

**Valid types:**

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

**Examples:**

```bash
git commit -m "feat: add habit streak tracking"
git commit -m "fix(auth): resolve password validation issue"
git commit -m "docs: update API documentation"
git commit -m "test: add unit tests for habit creation"
```

## Available Commands

### Testing Commands

```bash
# Run all tests (type-check + unit + E2E)
pnpm test:all

# Run quick tests (type-check + unit only)
pnpm test:quick

# Run unit tests only
pnpm test:run

# Run E2E tests only
pnpm test:e2e

# Run tests with coverage
pnpm test:coverage
```

### Code Quality Commands

```bash
# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Check formatting
pnpm format:check

# Type checking
pnpm type-check
```

### Manual Hook Testing

```bash
# Test lint-staged configuration
npx lint-staged

# Test specific hook
.husky/pre-commit

# Skip hooks (use with caution)
git commit --no-verify -m "message"
git push --no-verify
```

## Configuration Files

- **Package.json**: Contains lint-staged configuration
- **`.husky/`**: Contains all git hooks
- **`.eslintrc.json`**: ESLint configuration
- **`prettier.config.js`**: Prettier configuration
- **`playwright.config.ts`**: E2E test configuration

## Troubleshooting

### Hook Not Running

```bash
# Reinstall Husky hooks
pnpm prepare
# or
npx husky install
```

### Permission Issues

```bash
# Make hooks executable
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
chmod +x .husky/commit-msg
```

### Skip Hooks (Emergency Only)

```bash
# Skip pre-commit hook
git commit --no-verify -m "emergency fix"

# Skip pre-push hook
git push --no-verify
```

### Performance Issues

If hooks are too slow, you can:

1. **Disable E2E tests for feature branches**: Already configured
2. **Run specific tests**: Use `pnpm test:quick` instead of `pnpm test:all`
3. **Optimize test files**: Focus on critical test coverage

## Best Practices

1. **Commit frequently**: Small commits are easier to validate
2. **Fix issues promptly**: Don't accumulate linting/formatting errors
3. **Write tests**: Add tests for new features before committing
4. **Use conventional commits**: Helps with automated changelog generation
5. **Don't skip hooks**: Only use `--no-verify` in genuine emergencies

## Benefits

- **Consistent Code Quality**: All code follows the same standards
- **Prevent Broken Deployments**: Catch issues before they reach CI/CD
- **Faster Code Reviews**: Automated checks reduce manual review overhead
- **Better Git History**: Conventional commits improve project tracking
- **Collaborative Development**: Everyone follows the same quality standards

---

_This configuration ensures that all code pushed to the repository maintains high quality standards and passes comprehensive testing._
