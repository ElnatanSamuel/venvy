# Contributing to Venvy

Thank you for your interest in contributing to Venvy. This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork the repo on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/venvy.git
   cd venvy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the development environment**
   ```bash
   # Run tests to ensure everything is working
   npm test
   
   # Start development mode with watch
   npm run dev
   ```

4. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

## Project Structure

```
venvy/
├── src/
│   ├── cli/           # CLI commands and utilities
│   ├── core/          # Core validation and schema logic
│   ├── runtime/       # Runtime environment protection
│   └── utils/         # Utility functions
├── tests/             # Test files
├── docs/              # Documentation
├── examples/          # Example implementations
└── dist/              # Compiled output (generated)
```

## Development Workflow

### 1. Making Changes

- **Code Style**: Follow the existing TypeScript patterns and formatting
- **TypeScript**: Ensure all new code is properly typed
- **Tests**: Add tests for new features or bug fixes
- **Documentation**: Update README.md and add JSDoc comments as needed

### 2. Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### 3. Building

```bash
# Build the project
npm run build

# Build specific formats
npm run build:cjs  # CommonJS
npm run build:esm  # ES Modules
```

## Testing Guidelines

### Test Structure

- **Unit Tests**: Test individual functions and classes
- **Integration Tests**: Test CLI commands and workflows
- **Example Tests**: Ensure examples in documentation work

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest';
import { string, defineEnv } from '../src/index.js';

describe('String Validator', () => {
  it('should validate string values', () => {
    const schema = {
      TEST_VAR: string().required(),
    };
    
    const env = defineEnv(schema, { TEST_VAR: 'test' });
    expect(env.TEST_VAR).toBe('test');
  });
});
```

## Code Style

### TypeScript Guidelines

- Use explicit return types for public functions
- Prefer `interface` over `type` for object shapes
- Use `const` assertions where appropriate
- Follow the existing naming conventions

### Example

```typescript
// Good
export function createValidator(options: ValidatorOptions): Validator {
  // implementation
}

// Avoid
export function createValidator(options) {
  // implementation
}
```

## Bug Reports

When filing bug reports, please include:

1. **Environment Information**
   - Node.js version
   - Operating system
   - Venvy version

2. **Reproduction Steps**
   - Minimal reproduction code
   - Expected vs actual behavior
   - Error messages

3. **Additional Context**
   - Schema definition
   - Environment variables
   - Configuration files

### Bug Report Template

```markdown
## Bug Description
Brief description of the issue

## Environment
- Node.js: vXX.X.X
- OS: [Windows/macOS/Linux]
- Venvy: vX.X.X

## Reproduction Steps
1. Create schema with...
2. Run command...
3. Observe error...

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Additional Context
Any other relevant information
```

## Feature Requests

### Proposing Features

1. **Check existing issues** - Search for similar requests
2. **Use the template** - Provide detailed information
3. **Consider the scope** - Is this a core feature or extension?

### Feature Request Template

```markdown
## Feature Description
Clear description of the proposed feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should it work?

## Alternatives Considered
Other approaches you've thought about

## Additional Context
Mockups, examples, or other details
```

## Documentation

### Types of Documentation

- **README.md**: General usage and quick start
- **API Docs**: Detailed function documentation
- **Guides**: Step-by-step tutorials
- **Examples**: Code samples and use cases

### Documentation Guidelines

- Keep examples up-to-date
- Use code blocks with syntax highlighting
- Include expected outputs
- Link to related documentation

## Release Process

### Version Management

- Follow [Semantic Versioning](https://semver.org/)
- Update `package.json` version
- Update CHANGELOG.md
- Create GitHub release

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped
- [ ] Tag created
- [ ] Release published

## Pull Request Process

### Before Submitting

1. **Test thoroughly** - Ensure all tests pass
2. **Update documentation** - README, API docs, examples
3. **Check formatting** - Run linter if configured
4. **Rebase** - Keep commit history clean

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] All tests pass
- [ ] New tests added
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] CHANGELOG.md updated (if applicable)
```

### Merge Requirements

- At least one approval from maintainers
- All CI checks passing
- No merge conflicts
- Documentation updated

## Labels

We use these labels to categorize issues and PRs:

- `bug`: Bug reports and fixes
- `enhancement`: New features and improvements
- `documentation`: Documentation changes
- `good first issue`: Good for newcomers
- `help wanted`: Community contributions welcome
- `priority: high`: High priority issues

## Priority Areas

We're currently focusing on:

1. **Core Stability**: Improving validation accuracy
2. **Performance**: Optimizing for large schemas
3. **Developer Experience**: Better error messages and CLI UX
4. **Documentation**: Comprehensive guides and examples
5. **Ecosystem**: Integrations with popular frameworks

## Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and community discussion
- **Discord/Slack**: (if available) For real-time chat

## License

By contributing to Venvy, you agree that your contributions will be licensed under the MIT License.

---

## Thank You!

Thank you for contributing to Venvy. Your contributions help make environment variable management safer and more reliable for everyone.

Whether you're:
- Reporting bugs
- Adding features  
- Improving documentation
- Writing tests
- Helping others

Your contributions are valued and appreciated!

---

**Happy coding!**
