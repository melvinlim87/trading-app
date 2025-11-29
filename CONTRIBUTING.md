# Contributing to Trading App

Thank you for your interest in contributing to the Trading App! This document provides guidelines and instructions for contributing to the project.

## Development Setup

Please refer to [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup instructions.

## Code Style

### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### Backend (NestJS)
- Use dependency injection
- Follow NestJS module structure
- Use DTOs for request/response validation
- Implement proper error handling

### Frontend (Next.js)
- Use functional components with hooks
- Follow React best practices
- Use TypeScript interfaces for props
- Implement proper loading and error states

## Git Workflow

### Branch Naming
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `test/` - Test additions/updates

Example: `feature/add-options-chain`

### Commit Messages
Follow conventional commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test updates
- `chore`: Build/tooling changes

Example:
```
feat(orders): add multi-leg options support

- Implement multi-leg order validation
- Add UI for complex options strategies
- Update order execution logic

Closes #123
```

### Pull Request Process

1. **Create a branch** from `main`
2. **Make your changes** following code style guidelines
3. **Write tests** for new features
4. **Update documentation** if needed
5. **Run tests** and ensure they pass
6. **Submit a pull request** with a clear description

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests pass locally
```

## Testing

### Backend Tests
```bash
cd backend
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run test:cov      # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm run test          # Run tests
npm run test:watch    # Watch mode
```

## Code Review

### Review Checklist
- [ ] Code is readable and maintainable
- [ ] Follows project conventions
- [ ] Has appropriate tests
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance considerations addressed

### Review Comments
- Be constructive and respectful
- Explain the "why" behind suggestions
- Approve when ready or request changes

## Feature Development

### Planning
1. **Create an issue** describing the feature
2. **Discuss approach** with the team
3. **Break down** into smaller tasks
4. **Estimate effort** and timeline

### Implementation
1. **Create feature branch**
2. **Implement incrementally**
3. **Write tests** as you go
4. **Document** new APIs/features
5. **Submit PR** when ready

### Example Feature: Add Options Greeks Display

```typescript
// 1. Backend: Add Greeks calculation
// backend/src/market-data/market-data.service.ts
async calculateGreeks(optionId: string) {
  // Implementation
}

// 2. Backend: Add API endpoint
// backend/src/market-data/market-data.controller.ts
@Get('options/:id/greeks')
async getGreeks(@Param('id') id: string) {
  return this.marketDataService.calculateGreeks(id);
}

// 3. Frontend: Add API call
// frontend/src/lib/api/market-data.ts
export async function getOptionGreeks(optionId: string) {
  const response = await api.get(`/market-data/options/${optionId}/greeks`);
  return response.data;
}

// 4. Frontend: Display in UI
// frontend/src/components/options/greeks-display.tsx
export function GreeksDisplay({ optionId }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['greeks', optionId],
    queryFn: () => getOptionGreeks(optionId),
  });
  
  // Render Greeks
}
```

## Bug Fixes

### Bug Report Template
```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
If applicable

## Environment
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.0.0]
```

### Bug Fix Process
1. **Reproduce the bug** locally
2. **Write a failing test** that demonstrates the bug
3. **Fix the bug**
4. **Verify the test passes**
5. **Submit PR** with bug fix

## Documentation

### Code Documentation
- Add JSDoc comments for public APIs
- Document complex algorithms
- Include usage examples
- Keep comments up to date

### API Documentation
- Use Swagger decorators in NestJS
- Provide request/response examples
- Document error responses
- Include authentication requirements

### User Documentation
- Update README for user-facing changes
- Add screenshots for UI changes
- Write clear setup instructions
- Include troubleshooting tips

## Performance

### Backend Performance
- Use database indexes appropriately
- Implement caching for hot data
- Optimize N+1 queries
- Use pagination for large datasets

### Frontend Performance
- Lazy load components
- Optimize images
- Use React.memo for expensive components
- Implement virtualization for long lists

## Security

### Security Checklist
- [ ] No hardcoded secrets
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Rate limiting on sensitive endpoints
- [ ] Proper authentication/authorization

### Reporting Security Issues
- **Do not** create public issues for security vulnerabilities
- Email security concerns to: security@tradingapp.com
- Include detailed description and steps to reproduce

## Questions?

- Check existing documentation
- Search closed issues
- Ask in team chat
- Create a discussion issue

## License

By contributing, you agree that your contributions will be licensed under the project's license.

Thank you for contributing to Trading App! 🚀
