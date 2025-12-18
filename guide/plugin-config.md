# Plugin Configuration

This guide covers all configuration options available for WebArcade plugins.

## plugin.toml

The `plugin.toml` file is the main configuration file for your plugin. It defines metadata, dependencies, and other settings.

### Basic Structure

```toml
[plugin]
id = "my-plugin"
name = "My Plugin"
version = "1.0.0"
description = "A description of what this plugin does"
author = "Your Name"
license = "MIT"
homepage = "https://example.com/my-plugin"
repository = "https://github.com/username/my-plugin"

[dependencies]
# Other plugins this depends on

[settings]
# User-configurable settings
```

---

## [plugin] Section

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (lowercase, hyphens allowed) |
| `name` | string | Display name |
| `version` | string | Semantic version (e.g., "1.0.0") |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | Short description |
| `author` | string | Author name or organization |
| `license` | string | License identifier (e.g., "MIT", "GPL-3.0") |
| `homepage` | string | Plugin website URL |
| `repository` | string | Source code repository URL |
| `keywords` | array | Search keywords |
| `icon` | string | Path to plugin icon |
| `minVersion` | string | Minimum WebArcade version required |

### Example

```toml
[plugin]
id = "code-editor"
name = "Code Editor"
version = "2.1.0"
description = "A powerful code editor with syntax highlighting"
author = "WebArcade Team"
license = "MIT"
homepage = "https://webarcade.dev/plugins/code-editor"
repository = "https://github.com/webarcade/code-editor"
keywords = ["editor", "code", "syntax", "programming"]
icon = "icons/editor.png"
minVersion = "1.0.0"
```

---

## [dependencies] Section

Declare dependencies on other plugins:

```toml
[dependencies]
# Simple dependency
"file-manager" = "*"

# Version constraints
"syntax-highlighter" = ">=1.0.0"
"theme-manager" = "^2.0.0"

# Specific version
"ui-components" = "1.2.3"
```

### Version Constraint Syntax

| Syntax | Description |
|--------|-------------|
| `*` | Any version |
| `1.0.0` | Exact version |
| `>=1.0.0` | Greater than or equal |
| `<=1.0.0` | Less than or equal |
| `>1.0.0` | Greater than |
| `<1.0.0` | Less than |
| `^1.0.0` | Compatible with 1.x.x |
| `~1.0.0` | Compatible with 1.0.x |
| `1.0.0 - 2.0.0` | Range |

### Optional Dependencies

```toml
[dependencies]
"required-plugin" = "^1.0.0"

[dependencies.optional]
"optional-feature" = "^1.0.0"
```

---

## [settings] Section

Define user-configurable settings:

```toml
[settings]
# Simple types
theme = { type = "string", default = "dark" }
fontSize = { type = "number", default = 14, min = 8, max = 72 }
wordWrap = { type = "boolean", default = true }

# Enum (dropdown)
language = {
    type = "enum",
    default = "javascript",
    options = ["javascript", "typescript", "python", "rust"]
}

# String with validation
apiKey = {
    type = "string",
    default = "",
    secret = true,
    pattern = "^[a-zA-Z0-9]{32}$"
}
```

### Setting Types

| Type | Options |
|------|---------|
| `string` | `default`, `pattern`, `secret`, `minLength`, `maxLength` |
| `number` | `default`, `min`, `max`, `step` |
| `boolean` | `default` |
| `enum` | `default`, `options` |
| `color` | `default` |
| `file` | `default`, `accept` |
| `folder` | `default` |

### Grouped Settings

```toml
[settings.editor]
fontSize = { type = "number", default = 14 }
fontFamily = { type = "string", default = "monospace" }
tabSize = { type = "number", default = 4 }
wordWrap = { type = "boolean", default = true }

[settings.appearance]
theme = { type = "enum", default = "dark", options = ["light", "dark", "auto"] }
showLineNumbers = { type = "boolean", default = true }
showMinimap = { type = "boolean", default = true }

[settings.advanced]
autoSave = { type = "boolean", default = false }
autoSaveDelay = { type = "number", default = 1000, min = 100 }
```

### Accessing Settings

```jsx
// Get a setting value
const fontSize = api.settings.get('fontSize');
const theme = api.settings.get('editor.theme');

// Get with default fallback
const wrap = api.settings.get('wordWrap', true);

// Set a setting
api.settings.set('fontSize', 16);

// Watch for changes
api.settings.watch('fontSize', (newValue, oldValue) => {
    console.log(`Font size changed: ${oldValue} -> ${newValue}`);
});

// Get all settings
const allSettings = api.settings.getAll();

// Reset to defaults
api.settings.reset('fontSize');
api.settings.resetAll();
```

---

## [routes] Section (Rust Plugins)

Define HTTP routes for full-stack plugins:

```toml
[routes]
"GET /hello" = "handle_hello"
"GET /users" = "handle_list_users"
"GET /users/:id" = "handle_get_user"
"POST /users" = "handle_create_user"
"PUT /users/:id" = "handle_update_user"
"DELETE /users/:id" = "handle_delete_user"
```

### Route Syntax

```
"METHOD /path/:param" = "handler_function"
```

| Part | Description |
|------|-------------|
| `METHOD` | HTTP method (GET, POST, PUT, DELETE, PATCH) |
| `/path` | URL path |
| `:param` | Path parameter |
| `handler_function` | Rust function name in router.rs |

---

## [build] Section

Configure the build process:

```toml
[build]
# Entry point (default: index.jsx)
entry = "src/index.jsx"

# Output directory (default: build/)
outDir = "dist"

# External dependencies (don't bundle)
external = ["solid-js", "solid-js/web"]

# Minify output (default: true for production)
minify = true

# Source maps (default: false for production)
sourcemap = false

# Target environment
target = "es2020"
```

---

## [dev] Section

Development-specific settings:

```toml
[dev]
# Hot reload (default: true)
hotReload = true

# Port for dev server (if applicable)
port = 3000

# Open browser on start
open = false

# Verbose logging
verbose = true
```

---

## Environment Variables

Reference environment variables in config:

```toml
[settings]
apiUrl = { type = "string", default = "${API_URL}" }
apiDomain = { type = "string", default = "${API_DOMAIN}" }
```

---

## Complete Example

```toml
# plugin.toml - Complete configuration example

[plugin]
id = "code-editor"
name = "Code Editor Pro"
version = "2.5.0"
description = "Professional code editor with LSP support"
author = "WebArcade Team"
license = "MIT"
homepage = "https://webarcade.dev/plugins/code-editor"
repository = "https://github.com/webarcade/code-editor"
keywords = ["editor", "code", "lsp", "syntax"]
icon = "assets/icon.png"
minVersion = "1.2.0"

[dependencies]
"file-manager" = "^1.0.0"
"syntax-highlighter" = ">=2.0.0"

[dependencies.optional]
"git-integration" = "^1.0.0"
"ai-assistant" = "^1.0.0"

[settings.editor]
fontSize = { type = "number", default = 14, min = 8, max = 72 }
fontFamily = { type = "string", default = "Fira Code" }
tabSize = { type = "number", default = 4, min = 1, max = 8 }
insertSpaces = { type = "boolean", default = true }
wordWrap = { type = "boolean", default = false }
lineNumbers = { type = "enum", default = "on", options = ["on", "off", "relative"] }

[settings.appearance]
theme = { type = "enum", default = "auto", options = ["light", "dark", "auto"] }
minimap = { type = "boolean", default = true }
breadcrumbs = { type = "boolean", default = true }
scrollBeyondLastLine = { type = "boolean", default = false }

[settings.formatting]
formatOnSave = { type = "boolean", default = true }
formatOnPaste = { type = "boolean", default = false }
trimTrailingWhitespace = { type = "boolean", default = true }
insertFinalNewline = { type = "boolean", default = true }

[settings.lsp]
enabled = { type = "boolean", default = true }
serverPath = { type = "file", default = "" }
arguments = { type = "string", default = "" }

[routes]
"GET /files" = "handle_list_files"
"GET /files/*path" = "handle_read_file"
"POST /files/*path" = "handle_write_file"
"DELETE /files/*path" = "handle_delete_file"
"GET /search" = "handle_search"
"POST /format" = "handle_format"

[build]
entry = "src/index.jsx"
minify = true
sourcemap = false

[dev]
hotReload = true
verbose = false
```

### Using the Config in Code

```jsx
import { plugin } from 'webarcade';

export default plugin({
    id: 'code-editor',
    name: 'Code Editor Pro',
    version: '2.5.0',

    async start(api) {
        // Access settings
        const fontSize = api.settings.get('editor.fontSize');
        const theme = api.settings.get('appearance.theme');

        // Watch for setting changes
        api.settings.watch('editor.fontSize', (size) => {
            this.editor.setFontSize(size);
        });

        // Check for optional dependencies
        if (api.hasPlugin('git-integration')) {
            await this.initGitIntegration();
        }

        // Use required dependency
        const fileManager = await api.use('file-manager');

        // Register UI...
    }
});
```
