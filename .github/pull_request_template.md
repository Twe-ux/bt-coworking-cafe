# Pull Request

## 📝 Description

<!-- Describe what this PR does -->

## 🎯 Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)

## ✅ Checklist

### Code Quality
- [ ] No TypeScript `any` (or justified with comment)
- [ ] No debug `console.log` (only `console.error` for errors)
- [ ] All API calls in try/catch blocks
- [ ] TypeScript types properly defined
- [ ] Code follows project patterns and conventions

### Security & Validation
- [ ] User inputs validated (Zod/Yup or Mongoose)
- [ ] Authentication/authorization checked
- [ ] No sensitive data in logs
- [ ] No secrets in code

### Testing
- [ ] Manually tested (happy path)
- [ ] Edge cases tested
- [ ] No regressions on existing features
- [ ] Unit tests added (if applicable)

### Performance
- [ ] Images optimized (using next/image)
- [ ] DB queries optimized (.lean(), indexes)
- [ ] No N+1 queries
- [ ] Loading states implemented

### Documentation
- [ ] CLAUDE.md updated (if architecture changed)
- [ ] task.md updated (if task completed)
- [ ] Comments added for complex logic
- [ ] API documented (if new endpoints)

## 🔍 Review Instructions

**For Opus Review:**
```
Review la branche <branch-name>
```

## 📊 Expected Score

I expect this PR to score: **__/25**

- Architecture: __/5
- Code Quality: __/5
- Security: __/5
- Performance: __/5
- UX: __/5

## 📸 Screenshots (if applicable)

<!-- Add screenshots for UI changes -->

## 🔗 Related Issues

<!-- Link related issues: Closes #123 -->

---

**Ready for Review**: [ ] Yes [ ] No (work in progress)
