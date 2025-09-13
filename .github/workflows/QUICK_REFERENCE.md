# GitHub Project Quick Reference

## 🎯 Project URL
https://github.com/users/mrbin264/projects/4

## 📋 Status Workflow

```
Todo → In Progress → Done
```

## 🔄 Developer Checklist

### **Starting a User Story**
- [ ] Assign yourself to the GitHub issue
- [ ] Move status from "Todo" to "In Progress"
- [ ] Create feature branch: `git checkout -b feature/mvc-xxx-description`
- [ ] Review user story documentation in `docs/phase*/issues/MVC-XXX-*.md`

### **During Development**  
- [ ] Follow technical implementation guidelines
- [ ] Implement all acceptance criteria
- [ ] Write tests (unit, integration, e2e)
- [ ] Run `npm run lint && npm run test` before commits
- [ ] Use conventional commit messages

### **Before Completion**
- [ ] All acceptance criteria validated ✅
- [ ] Tests passing locally
- [ ] Code review completed
- [ ] Staging deployment verified
- [ ] Performance benchmarks met

### **Marking Complete**
- [ ] Create PR with detailed description
- [ ] Link PR to GitHub issue
- [ ] Move status to "Done" 
- [ ] Clean up feature branch after merge

## 🎯 Priority Order

1. **MVC-000** (Critical) - Project Setup Foundation
2. **Phase 1** (High Priority) - MVP Features  
3. **Phase 2** (Medium Priority) - Pro Features

## 🔍 Quick Commands

```bash
# View project
gh project view 4 --owner mrbin264

# Start development
git checkout -b feature/mvc-xxx-name
npm run dev

# Quality checks
npm run lint && npm run test && npm run type-check

# Create PR
gh pr create --title "[MVC-XXX] Feature name" --base develop
```

---
*Keep this reference handy during development!*