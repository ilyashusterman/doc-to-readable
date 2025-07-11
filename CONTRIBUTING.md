# Contributing to doc-to-readable

We welcome contributions from the community! Whether you're reporting a bug, suggesting a feature, or submitting code changes, your help is appreciated.

## How to Contribute

### 🐛 Reporting Bugs
- Use the [Bug Report template](/.github/ISSUE_TEMPLATE/bug_report.md) when creating issues
- Provide a minimal reproduction example
- Include your environment details (OS, Node.js version, package version)
- Search existing issues to avoid duplicates

### 💡 Suggesting Features
- Use the [Feature Request template](/.github/ISSUE_TEMPLATE/feature_request.md)
- Clearly describe the problem and proposed solution
- Explain the expected impact and use cases
- Consider if the feature would benefit the broader community

### ❓ Asking Questions
- Use the [Question template](/.github/ISSUE_TEMPLATE/question.md) for support
- Provide context about what you're trying to accomplish
- Include relevant code examples
- Search existing issues and documentation first

### 🔧 Submitting Pull Requests

#### Before You Start
1. **Fork the repository** and clone your fork locally
2. **Create a feature branch** from `main`: `git checkout -b feature/your-feature-name`
3. **Install dependencies**: `npm install`

#### Development Guidelines
- **Code Style**: Follow the existing code style and ESLint rules
- **TypeScript**: Use TypeScript for new code when possible
- **Tests**: Write tests for new functionality and ensure all tests pass
- **Documentation**: Update README.md and add JSDoc comments for new APIs

#### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run benchmark tests
npm run test:benchmark

# Run standalone tests
npm run test:standalone
```

#### Commit Guidelines
- Use conventional commit messages: `type(scope): description`
- Examples:
  - `feat: add new PDF processing option`
  - `fix: resolve memory leak in large file processing`
  - `docs: update README with new examples`
  - `test: add tests for edge case handling`

#### Pull Request Process
1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Ensure all tests pass** locally
4. **Update version** if adding new features (we'll handle this)
5. **Submit PR** with a clear description of changes
6. **Link related issues** in your PR description

### 🏷️ Issue Labels
We use labels to categorize issues:
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `question` - General questions
- `help wanted` - Good for new contributors
- `good first issue` - Perfect for first-time contributors
- `needs-triage` - Needs review and categorization

### 📋 Development Setup

#### Prerequisites
- Node.js 18+ 
- npm or yarn

#### Local Development
```bash
# Clone your fork
git clone https://github.com/your-username/doc-to-readable.git
cd doc-to-readable

# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build
```

#### Demo App Development
```bash
# Navigate to demo directory
cd demo

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### 🚀 Publishing Process
- Only maintainers can publish to npm
- We use semantic versioning (patch/minor/major)
- New features typically get minor version bumps
- Bug fixes get patch version bumps

### 📞 Getting Help
- **Issues**: Use the appropriate issue template
- **Discussions**: Use GitHub Discussions for general questions
- **Code Review**: All PRs require review before merging

### 🎯 Good First Issues
Look for issues labeled with `good first issue` or `help wanted` if you're new to the project. These are typically:
- Documentation improvements
- Simple bug fixes
- Test additions
- Performance optimizations

### 📄 License
By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to doc-to-readable! 🚀 