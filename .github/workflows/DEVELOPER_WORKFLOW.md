# Developer Workflow Guide

## GitHub Project Management for Mind Voyage Companion

This document outlines the complete developer workflow for managing user stories in our GitHub Project from initial assignment to completion.

---

## 🎯 Project Overview

- **GitHub Project**: [Mind Voyage Companion - Development](https://github.com/users/mrbin264/projects/4)
- **Repository**: [mind-voyage-companion](https://github.com/mrbin264/mind-voyage-companion)
- **Development Method**: Agile with Story Points and Phase-based development

---

## 📋 Project Structure

### **Phases**
- **Phase 0**: Foundation (MVC-000) - Critical infrastructure setup
- **Phase 1**: MVP (MVC-001 to MVC-007) - Core application features
- **Phase 2**: Pro Features (MVC-008 to MVC-012) - Advanced paid features

### **Custom Fields**
- **Phase**: 0 - Foundation | 1 - MVP | 2 - Pro Features
- **Priority**: Critical | High | Medium | Low  
- **Story Points**: Numerical effort estimation (1-34 points)
- **Status**: Todo | In Progress | Done

---

## 🔄 Complete Development Workflow

### **Step 1: Story Selection & Assignment**

#### 1.1 Choose User Story
```bash
# Navigate to the GitHub Project
open https://github.com/users/mrbin264/projects/4

# Filter by Phase and Priority to select next story
# Recommended order: MVC-000 → Phase 1 (High Priority) → Phase 2
```

#### 1.2 Update Project Fields
- **Assignee**: Assign yourself to the issue
- **Status**: Change from "Todo" to "In Progress"  
- **Phase**: Verify correct phase assignment
- **Priority**: Confirm priority level
- **Story Points**: Review effort estimation

#### 1.3 Create Feature Branch
```bash
# Create and switch to feature branch
git checkout develop
git pull origin develop
git checkout -b feature/mvc-xxx-brief-description

# Example: git checkout -b feature/mvc-001-user-onboarding
```

---

### **Step 2: Technical Implementation**

#### 2.1 Review User Story Documentation
```bash
# Read the detailed user story file
cat docs/phase1/issues/MVC-XXX-story-name.md
# or
cat docs/phase2/issues/MVC-XXX-story-name.md
```

#### 2.2 Follow Technical Implementation Guidelines
Each user story contains:
- **Acceptance Criteria**: Specific requirements to meet
- **Technical Implementation Details**: Architecture and code patterns
- **API Endpoints**: Backend interfaces to implement
- **Frontend Components**: UI components to create
- **Database Schema**: Data models and migrations
- **Testing Strategy**: Required test coverage

#### 2.3 Implementation Checklist
- [ ] **Database Changes**: Run migrations if schema changes required
- [ ] **Backend API**: Implement all specified endpoints
- [ ] **Frontend Components**: Create UI components per specifications
- [ ] **Server Components**: Use RSC patterns for optimal performance
- [ ] **Client Components**: Add `'use client'` for interactive features
- [ ] **Type Safety**: Implement TypeScript interfaces and Zod validation
- [ ] **Error Handling**: Add proper error boundaries and user feedback
- [ ] **Security**: Implement authentication and authorization checks
- [ ] **Testing**: Write unit, integration, and E2E tests

---

### **Step 3: Development Standards**

#### 3.1 Code Quality Standards
```bash
# Run linting and formatting before each commit
npm run lint
npm run format
npm run type-check

# Run tests to ensure no regressions
npm run test
npm run test:e2e
```

#### 3.2 Commit Message Convention
```bash
# Use conventional commit format
git commit -m "feat(mvc-xxx): add user authentication system

- Implement Auth.js v5 integration
- Add Azure AD provider configuration
- Create user session management
- Add protected route middleware

Closes #1"
```

#### 3.3 Code Review Requirements
- **Self-Review**: Review your own changes before creating PR
- **Documentation**: Update README or API docs if needed
- **Performance**: Ensure acceptable loading times
- **Accessibility**: Test with screen readers and keyboard navigation
- **Mobile**: Verify responsive design on mobile devices

---

### **Step 4: Testing & Validation**

#### 4.1 Local Testing Checklist
```bash
# Start development server
npm run dev

# Test all acceptance criteria manually
# Run automated test suites
npm run test:unit
npm run test:integration
npm run test:e2e

# Check accessibility
npm run a11y-test

# Performance testing
npm run lighthouse
```

#### 4.2 Acceptance Criteria Validation
Go through each acceptance criteria in the user story and verify:
- [ ] **Functional Requirements**: All features work as specified
- [ ] **User Experience**: Intuitive and accessible interface
- [ ] **Performance**: Meets performance targets (FCP <1.5s, TTI <3s)
- [ ] **Security**: Authentication and authorization working correctly
- [ ] **Error Handling**: Graceful error states and user feedback
- [ ] **Cross-browser**: Works in Chrome, Firefox, Safari
- [ ] **Mobile**: Responsive design on various screen sizes

---

### **Step 5: Pull Request & Code Review**

#### 5.1 Create Pull Request
```bash
# Push feature branch
git push origin feature/mvc-xxx-brief-description

# Create PR via GitHub CLI
gh pr create \
  --title "[MVC-XXX] Brief description of changes" \
  --body "## Changes
- Detailed list of implemented features
- Any breaking changes
- Testing notes

## Closes
Closes #X

## Checklist
- [x] All acceptance criteria met
- [x] Tests passing
- [x] Documentation updated
- [x] Performance verified
- [x] Accessibility tested" \
  --base develop \
  --head feature/mvc-xxx-brief-description
```

#### 5.2 Code Review Process
- **Automated Checks**: Ensure CI/CD pipeline passes
- **Manual Review**: Address reviewer feedback promptly
- **Testing**: Verify staging deployment works correctly
- **Documentation**: Update any relevant documentation

---

### **Step 6: Deployment & Completion**

#### 6.1 Merge to Develop
```bash
# After PR approval, merge to develop
# This triggers automatic deployment to staging environment

# Switch back to develop and pull latest
git checkout develop
git pull origin develop

# Delete feature branch
git branch -d feature/mvc-xxx-brief-description
git push origin --delete feature/mvc-xxx-brief-description
```

#### 6.2 Update GitHub Project Status
- **Status**: Change from "In Progress" to "Done"
- **Comments**: Add completion notes and any follow-up items
- **Link PR**: Ensure PR is linked to the issue

#### 6.3 Staging Validation
```bash
# Verify on staging environment
# Test all acceptance criteria in production-like environment
# Confirm deployment was successful
```

#### 6.4 Production Deployment (when ready)
- **Release Notes**: Document changes for release
- **Production Deploy**: Merge develop to main for production release
- **Monitoring**: Watch application metrics and error rates
- **User Communication**: Notify users of new features if applicable

---

## 🚀 Quick Reference Commands

### **GitHub CLI Commands**
```bash
# View project
gh project view 4 --owner mrbin264

# Add item to project
gh project item-add 4 --owner mrbin264 --url <issue-url>

# Create issue
gh issue create --title "[MVC-XXX] Title" --body "Description"

# Create PR
gh pr create --title "Title" --body "Description"

# View issues
gh issue list --state open

# View PRs
gh pr list --state open
```

### **Development Commands**
```bash
# Start development
npm run dev

# Run tests
npm run test        # Unit tests
npm run test:e2e    # End-to-end tests
npm run test:a11y   # Accessibility tests

# Code quality
npm run lint        # ESLint
npm run format      # Prettier
npm run type-check  # TypeScript

# Build
npm run build       # Production build
npm run start       # Production server
```

### **Database Commands**
```bash
# Database migrations
npx prisma migrate dev    # Apply migrations
npx prisma generate       # Generate client
npx prisma studio         # Database GUI
npx prisma db seed        # Seed database
```

---

## 📊 Sprint Planning & Estimation

### **Story Point Guidelines**
- **1-3 points**: Simple component or minor feature
- **5-8 points**: Medium complexity feature with backend + frontend
- **13-21 points**: Complex feature with multiple components
- **21+ points**: Large feature requiring multiple weeks

### **Sprint Capacity**
- **Developer Capacity**: ~20-30 story points per 2-week sprint
- **Sprint Goal**: Focus on completing full user stories, not partial work
- **Dependency Management**: Complete prerequisite stories before dependent ones

### **Progress Tracking**
- **Daily Updates**: Move items between status columns as work progresses
- **Sprint Reviews**: Demonstrate completed user stories
- **Retrospectives**: Identify improvements for next sprint

---

## 🔍 Troubleshooting & Support

### **Common Issues**
1. **CI/CD Failures**: Check GitHub Actions logs
2. **Test Failures**: Run tests locally first
3. **Deployment Issues**: Verify environment variables and Azure configuration
4. **Performance Problems**: Use React DevTools and Lighthouse
5. **Type Errors**: Ensure proper TypeScript configuration

### **Getting Help**
- **Documentation**: Check user story technical implementation details
- **Code Review**: Request specific feedback on challenging implementations
- **Architecture Questions**: Discuss with team before major changes

### **Quality Gates**
Before marking any story as "Done":
- [ ] All acceptance criteria completed
- [ ] Tests passing (unit, integration, e2e)
- [ ] Code review approved
- [ ] Deployed to staging successfully
- [ ] Performance benchmarks met
- [ ] Accessibility standards met
- [ ] Security requirements fulfilled

---

## 📝 Documentation Updates

Remember to update documentation when completing stories:
- **README.md**: New features or setup changes
- **API Documentation**: New endpoints or schema changes
- **User Stories**: Mark acceptance criteria as complete
- **CHANGELOG.md**: User-facing changes
- **Architecture Docs**: Significant technical changes

This workflow ensures consistent, high-quality development while maintaining visibility into project progress and team productivity.