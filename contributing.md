# Contributing Guide

Thank you for your interest in contributing to WebArcade! This guide will help you get started.

## Ways to Contribute

- **Report bugs** - Found a bug? Open an issue
- **Suggest features** - Have an idea? We'd love to hear it
- **Improve documentation** - Help make the docs better
- **Write code** - Fix bugs or add features
- **Create plugins** - Build and share plugins with the community

---

## Setting Up the Development Environment

### Prerequisites

- [Rust](https://rustup.rs/) (latest stable)
- [Bun](https://bun.sh/) (v1.0+)
- [Git](https://git-scm.com/)
- A code editor (VS Code recommended)

### Clone the Repositories

```bash
# Clone the core repository
git clone https://github.com/warcade/core.git webarcade-core
cd webarcade-core

# Install dependencies
bun install

# Build and run
cargo build
bun dev
```

### Repository Structure

```
warcade/
├── core/           # Main application (SolidJS + Tauri)
├── cli/            # Command-line tool (Rust)
├── api/            # Plugin API crate (Rust)
└── docs/           # Documentation
```

---

## Development Workflow

### 1. Create a Branch

```bash
# Create a feature branch
git checkout -b feature/my-feature

# Or a bugfix branch
git checkout -b fix/issue-123
```

### 2. Make Your Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

```bash
# Run the test suite
cargo test

# Run specific tests
cargo test test_name

# Run with logging
RUST_LOG=debug cargo test

# Run the app to test manually
bun dev
```

### 4. Commit Your Changes

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Feature
git commit -m "feat: add dark mode toggle"

# Bug fix
git commit -m "fix: resolve crash on startup"

# Documentation
git commit -m "docs: update plugin API guide"

# Refactoring
git commit -m "refactor: simplify panel management"

# Performance
git commit -m "perf: optimize plugin loading"
```

### 5. Push and Create a Pull Request

```bash
git push origin feature/my-feature
```

Then open a Pull Request on GitHub.

---

## Code Style

### Rust

We follow the standard Rust style guidelines:

```rust
// Use snake_case for functions and variables
fn handle_request(request: HttpRequest) -> HttpResponse {
    let user_id = request.get_param("id");
    // ...
}

// Use CamelCase for types
struct PluginConfig {
    name: String,
    version: String,
}

// Use SCREAMING_SNAKE_CASE for constants
const MAX_PLUGINS: usize = 100;

// Document public items
/// Handles incoming HTTP requests for the plugin.
///
/// # Arguments
/// * `request` - The incoming HTTP request
///
/// # Returns
/// An HTTP response
pub async fn handle_request(request: HttpRequest) -> HttpResponse {
    // ...
}
```

Run `cargo fmt` before committing:
```bash
cargo fmt
cargo clippy
```

### JavaScript/JSX

We use Prettier for formatting:

```jsx
// Use camelCase for variables and functions
const userName = 'John';
function handleClick() { }

// Use PascalCase for components
function UserProfile({ user }) {
    return <div>{user.name}</div>;
}

// Prefer arrow functions for callbacks
items.map((item) => <Item key={item.id} item={item} />);

// Use destructuring
const { name, email } = user;

// Prefer const over let
const items = [];
```

Run Prettier before committing:
```bash
bun run format
```

---

## Writing Tests

### Rust Tests

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_config() {
        let config = parse_config("test.toml").unwrap();
        assert_eq!(config.name, "test-plugin");
        assert_eq!(config.version, "1.0.0");
    }

    #[tokio::test]
    async fn test_handle_request() {
        let request = HttpRequest::new("GET", "/hello");
        let response = handle_request(request).await;
        assert_eq!(response.status, 200);
    }
}
```

### Frontend Tests

```jsx
import { describe, it, expect } from 'vitest';
import { render } from '@solidjs/testing-library';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
    it('renders user name', () => {
        const user = { name: 'John', email: 'john@example.com' };
        const { getByText } = render(() => <UserProfile user={user} />);
        expect(getByText('John')).toBeInTheDocument();
    });
});
```

---

## Documentation

### Writing Documentation

- Use clear, concise language
- Include code examples
- Keep examples simple and focused
- Test all code examples

### Documentation Structure

```markdown
# Page Title

Brief introduction to the topic.

## Section

Explanation of the concept.

### Subsection

More detailed information.

```jsx
// Code example
const example = 'code';
```

::: tip
Helpful tips go here.
:::

::: warning
Important warnings go here.
:::
```

### Building Documentation

```bash
cd docs
bun install
bun dev     # Local preview
bun build   # Production build
```

---

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows the style guide
- [ ] Tests pass (`cargo test`)
- [ ] Documentation updated (if applicable)
- [ ] Commit messages follow conventions
- [ ] No merge conflicts

### PR Description Template

```markdown
## Description
Brief description of the changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested these changes.

## Screenshots (if applicable)
Add screenshots for UI changes.

## Related Issues
Closes #123
```

### Review Process

1. A maintainer will review your PR
2. Address any requested changes
3. Once approved, a maintainer will merge

---

## Creating Plugins

### Plugin Guidelines

1. **Clear purpose** - Plugins should do one thing well
2. **Good defaults** - Work out of the box
3. **Configurable** - Allow customization via settings
4. **Well documented** - Include README and examples
5. **Tested** - Include tests for critical functionality

### Plugin Template

```jsx
import { plugin } from '@/api/plugin';

export default plugin({
    id: 'my-awesome-plugin',
    name: 'My Awesome Plugin',
    version: '1.0.0',

    start(api) {
        // Initialize plugin
        api.register('main-view', {
            type: 'panel',
            component: MainView,
            label: 'My Plugin'
        });
    },

    stop(api) {
        // Cleanup when plugin is disabled
    }
});
```

### Publishing Plugins

1. Create a GitHub repository for your plugin
2. Include a README with:
   - Description
   - Installation instructions
   - Configuration options
   - Screenshots

3. Users can install via:
```bash
webarcade install username/plugin-name
```

---

## Issue Guidelines

### Bug Reports

Include:
- WebArcade version
- Operating system
- Steps to reproduce
- Expected behavior
- Actual behavior
- Error messages/screenshots

### Feature Requests

Include:
- Clear description of the feature
- Use case / problem it solves
- Possible implementation ideas
- Mockups/examples (if applicable)

---

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn
- Focus on the code, not the person
- No harassment or discrimination

---

## Getting Help

- **Questions:** Open a Discussion on GitHub
- **Chat:** Join our [Discord](https://discord.gg/webarcade)
- **Email:** contribute@webarcade.dev

---

## Recognition

Contributors are recognized in:
- Release notes
- Contributors page on the website
- GitHub contributors list

Thank you for contributing to WebArcade!
