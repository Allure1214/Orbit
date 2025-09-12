# Commit Message Guide

## Format
```
type: brief description
```

## Types
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code formatting (no logic change)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## Examples

### Good Examples
```bash
git commit -m "feat: add weather widget component"
git commit -m "fix: resolve database connection issue"
git commit -m "docs: update setup instructions"
git commit -m "style: format code with prettier"
git commit -m "refactor: optimize API calls"
git commit -m "chore: update dependencies"
```

### Bad Examples
```bash
git commit -m "update stuff"  # Too vague
git commit -m "fix"  # No description
git commit -m "added weather widget and fixed database and updated docs"  # Too many changes
```

## Best Practices
- Keep under 50 characters for the subject line
- Use present tense ("add" not "added")
- Be specific about what changed
- One logical change per commit
