# CLI Reference

The WebArcade CLI (`webarcade`) helps you create, build, and manage plugins and applications.

## Installation

```bash
cargo install webarcade
```

Verify installation:

```bash
webarcade --version
```

---

## Command Overview

| Command | Description |
|---------|-------------|
| `webarcade init` | Create a new project |
| `webarcade new` | Create a new plugin |
| `webarcade build` | Build plugins |
| `webarcade dev` | Build and run in development mode |
| `webarcade run` | Run an already-built application |
| `webarcade app` | Build production application |
| `webarcade install` | Install plugin from GitHub |
| `webarcade list` | List available plugins |
| `webarcade package` | Package for distribution |
| `webarcade sync` | Sync project's app folder with latest core |

---

## webarcade init

Create a new WebArcade project.

### Syntax

```bash
webarcade init <name>
```

### Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `name` | Yes | Project name (creates folder with this name) |

### Examples

```bash
# Create a new project called "my-app"
webarcade init my-app

# Then enter the project
cd my-app
```

### What It Creates

```
my-app/
├── src/                    # Frontend source
├── app/                    # Desktop runtime
├── plugins/                # Plugin source code
│   └── hello-world/       # Example plugin
├── package.json
└── README.md
```

---

## webarcade new

Create a new plugin.

### Syntax

```bash
webarcade new <plugin-id> [options]
```

### Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `plugin-id` | Yes | Unique plugin identifier (lowercase, hyphens allowed) |

### Options

| Option | Description |
|--------|-------------|
| `--frontend-only` | Create without Rust backend |
| `--name <name>` | Display name (default: plugin-id) |
| `--author <author>` | Author name |

### Examples

```bash
# Create a full-stack plugin (with Rust backend)
webarcade new my-plugin

# Create a frontend-only plugin (JavaScript only)
webarcade new my-plugin --frontend-only

# Create with metadata
webarcade new my-plugin --name "My Plugin" --author "Your Name"

# Create frontend-only with metadata
webarcade new file-manager --frontend-only --name "File Manager" --author "Dev Team"
```

### Frontend-Only Plugin Structure

```
plugins/my-plugin/
└── index.jsx               # Entry point
```

### Full-Stack Plugin Structure

```
plugins/my-plugin/
├── index.jsx               # Frontend entry
├── Cargo.toml              # Rust config & routes
├── mod.rs                  # Plugin metadata
└── router.rs               # HTTP handlers
```

---

## webarcade build

Build one or more plugins.

### Syntax

```bash
webarcade build <plugin-id>
webarcade build --all
```

### Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `plugin-id` | Yes* | Plugin to build (*or use `--all`) |

### Options

| Option | Description |
|--------|-------------|
| `--all` | Build all plugins |

### Examples

```bash
# Build a specific plugin
webarcade build my-plugin

# Build all plugins in the project
webarcade build --all
```

### Build Output

| Plugin Type | Output Files | Location |
|-------------|--------------|----------|
| Frontend-only | `plugin-id.js` | `build/plugins/` |
| Full-stack | `plugin-id.js` + `plugin-id.dll` | `build/plugins/` |

Built plugins are automatically copied to `app/plugins/` for the runtime.

### Build Times

| Plugin Type | Typical Time |
|-------------|--------------|
| Frontend-only | ~1 second |
| Full-stack (first build) | 30-60 seconds |
| Full-stack (rebuild) | 5-15 seconds |

---

## webarcade dev

Build and run the application in development mode.

### Syntax

```bash
webarcade dev
```

### What It Does

1. Builds the frontend (SolidJS)
2. Builds all plugins
3. Compiles the Rust runtime
4. Launches the application window

### Examples

```bash
# Run in development mode
webarcade dev
```

### Notes

- First run is slow (Rust compilation)
- Subsequent runs are faster
- Press `Ctrl+C` to stop
- Changes require rebuild: `webarcade build <plugin>` then restart

---

## webarcade run

Run an already-built application without rebuilding.

### Syntax

```bash
webarcade run [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--release` | Run the release build instead of debug |
| `--verbose` | Show detailed output |

### Examples

```bash
# Run the debug build
webarcade run

# Run the release build
webarcade run --release

# Run with verbose logging
webarcade run --verbose
```

### What It Does

1. Launches the pre-built application
2. Does NOT rebuild plugins or frontend
3. Uses existing build artifacts

### When to Use

| Scenario | Command |
|----------|---------|
| Making code changes | `webarcade dev` |
| Testing without changes | `webarcade run` |
| Testing production build | `webarcade run --release` |

### Notes

- Faster than `webarcade dev` since it skips building
- Use after `webarcade build --all` to test changes
- Useful for quick restarts during debugging

---

## webarcade app

Build the production application.

### Syntax

```bash
webarcade app [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--locked` | Embed all plugins in the binary |

### Examples

```bash
# Build production app (unlocked mode)
# Plugins in separate folder
webarcade app

# Build production app (locked mode)
# Single executable with embedded plugins
webarcade app --locked
```

### Unlocked Mode Output

```
app/target/release/
├── my-app.exe              # Executable
└── plugins/                # Plugin files
    ├── plugin-a.js
    ├── plugin-a.dll
    └── plugin-b.js
```

### Locked Mode Output

```
app/target/release/
└── my-app.exe              # Everything embedded
```

### Comparison

| Feature | Unlocked | Locked |
|---------|----------|--------|
| File count | Multiple | Single |
| Users can add plugins | Yes | No |
| Total size | Larger | Smaller |
| Startup time | Slower | Faster |

---

## webarcade install

Install a plugin from GitHub.

### Syntax

```bash
webarcade install <user/repo> [options]
```

### Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `user/repo` | Yes | GitHub repository (e.g., `username/plugin-name`) |

### Options

| Option | Description |
|--------|-------------|
| `-f, --force` | Force reinstall (overwrite existing) |

### Examples

```bash
# Install from GitHub
webarcade install johndoe/cool-plugin

# Force reinstall (overwrites existing)
webarcade install johndoe/cool-plugin -f
webarcade install johndoe/cool-plugin --force
```

### How It Works

1. Clones the repository from GitHub
2. Validates it's a valid WebArcade plugin
3. Checks if already installed and compares versions
4. If newer version, prompts to update
5. Copies plugin source to `plugins/` folder

### Plugin Repository Structure

The plugin can be at the repository root:

```
cool-plugin/
├── index.jsx               # Required
├── mod.rs                  # Optional (full-stack)
├── Cargo.toml              # Optional (full-stack)
└── router.rs               # Optional (full-stack)
```

Or in a subdirectory:

```
cool-plugin-repo/
├── README.md
├── LICENSE
└── plugin/                 # Plugin here
    ├── index.jsx
    └── ...
```

### After Installing

```bash
# Build the installed plugin
webarcade build cool-plugin

# Run to see it
webarcade dev
```

---

## webarcade list

List all plugins in the project.

### Syntax

```bash
webarcade list
```

### Example Output

```
Available plugins:

  hello-world (1.0.0) - frontend-only
    A simple hello world plugin

  file-manager (2.1.0) - full-stack
    File management with Rust backend

  themes (1.0.0) - frontend-only
    Theme management plugin
```

### Information Shown

- Plugin ID
- Version
- Type (frontend-only or full-stack)
- Description (if available)

---

## webarcade package

Package your application for distribution.

### Syntax

```bash
webarcade package [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--locked` | Embed plugins in binary |
| `--target <platform>` | Target platform (see below) |
| `--format <format>` | Output format (see below) |
| `--output <path>` | Output directory |
| `--no-sign` | Skip code signing |
| `--verbose` | Show detailed output |

### Target Platforms

| Value | Description |
|-------|-------------|
| `windows-x64` | Windows 64-bit |
| `windows-x86` | Windows 32-bit |
| `windows-arm64` | Windows ARM64 |
| `macos-x64` | macOS Intel |
| `macos-arm64` | macOS Apple Silicon |
| `macos-universal` | macOS Universal (both architectures) |
| `linux-x64` | Linux 64-bit |
| `linux-arm64` | Linux ARM64 |

### Output Formats

| Value | Platforms | Description |
|-------|-----------|-------------|
| `exe` | Windows | Standalone executable |
| `msi` | Windows | Windows Installer package |
| `nsis` | Windows | NSIS installer |
| `app` | macOS | Application bundle |
| `dmg` | macOS | Disk image |
| `pkg` | macOS | macOS Installer package |
| `deb` | Linux | Debian package |
| `rpm` | Linux | RPM package |
| `appimage` | Linux | AppImage |
| `tar.gz` | All | Compressed archive |
| `zip` | All | ZIP archive |

### Examples

```bash
# Interactive packaging (prompts for options)
webarcade package

# Package with locked plugins
webarcade package --locked

# Package for specific platform
webarcade package --target windows-x64

# Create Windows installer
webarcade package --target windows-x64 --format msi

# Create macOS disk image
webarcade package --target macos-universal --format dmg

# Create Linux AppImage
webarcade package --target linux-x64 --format appimage

# Specify output directory
webarcade package --target windows-x64 --format exe --output ./dist

# Skip code signing (useful for testing)
webarcade package --target macos-arm64 --format dmg --no-sign
```

### What It Does

1. Builds the production application (`webarcade app`)
2. Packages according to the specified format
3. Applies code signing (if configured)
4. Creates installer/archive in output directory

### Code Signing

#### Windows

Set environment variables:
```bash
WEBARCADE_SIGN_CERT=path/to/certificate.pfx
WEBARCADE_SIGN_PASSWORD=certificate_password
```

#### macOS

Requires Apple Developer certificate:
```bash
WEBARCADE_SIGN_IDENTITY="Developer ID Application: Your Name (TEAM_ID)"
WEBARCADE_NOTARIZE_APPLE_ID=your@email.com
WEBARCADE_NOTARIZE_PASSWORD=app-specific-password
WEBARCADE_NOTARIZE_TEAM_ID=TEAM_ID
```

### Output Structure

```
dist/
├── my-app-1.0.0-windows-x64.msi
├── my-app-1.0.0-macos-universal.dmg
└── my-app-1.0.0-linux-x64.AppImage
```

---

## webarcade sync

Sync your project's `app/src` folder with the latest core framework code.

### Syntax

```bash
webarcade sync [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-b, --branch <branch>` | Git branch to sync from (default: `main`) |
| `--dry-run` | Show what would be synced without making changes |

### Examples

```bash
# Sync with latest main branch
webarcade sync

# Sync with a specific branch
webarcade sync --branch develop

# Preview changes without applying
webarcade sync --dry-run
```

### What It Does

1. Fetches the latest `app/src` from the WebArcade core repository
2. Copies updated Rust source files to your project's `app/src`
3. Preserves your local configuration files

### When to Use

Use this command when:
- A new version of WebArcade is released with core improvements
- You want to get the latest Rust backend features
- Bug fixes have been made to the core runtime

::: warning
This overwrites files in `app/src/`. Your plugin code in `plugins/` is not affected.
:::

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `RUST_LOG` | Set log level: `debug`, `info`, `warn`, `error` |

### Examples

```bash
# Show debug logs
RUST_LOG=debug webarcade dev

# Show only warnings and errors
RUST_LOG=warn webarcade dev
```

---

## Common Workflows

### Creating a New Project

```bash
# 1. Create project
webarcade init my-app
cd my-app

# 2. Create a plugin
webarcade new my-plugin --frontend-only

# 3. Edit the plugin
# (edit plugins/my-plugin/index.jsx)

# 4. Build and run
webarcade build my-plugin
webarcade dev
```

### Adding Features to a Plugin

```bash
# 1. Edit your plugin
# (edit plugins/my-plugin/index.jsx)

# 2. Rebuild
webarcade build my-plugin

# 3. Restart the app
# (Ctrl+C to stop, then:)
webarcade dev
```

### Installing an External Plugin

```bash
# 1. Install from GitHub
webarcade install author/cool-plugin

# 2. Build it
webarcade build cool-plugin

# 3. Run
webarcade dev
```

### Building for Distribution

```bash
# 1. Build all plugins
webarcade build --all

# 2. Build production app
webarcade app

# Or for single-file distribution:
webarcade app --locked
```

---

## Troubleshooting

### "Plugin not detected"

**Cause:** Missing `index.jsx` in plugin folder.

**Solution:** Ensure `plugins/plugin-name/index.jsx` exists.

### "Handler not found"

**Cause:** Route name in `Cargo.toml` doesn't match function name.

**Solution:** Check that route names exactly match function names:

```toml
# Cargo.toml
[routes]
"GET /hello" = "handle_hello"  # Must match function name
```

```rust
// router.rs
pub async fn handle_hello(req: HttpRequest) -> HttpResponse {  // This name
    // ...
}
```

### "Build failed"

**Cause:** Handler signature is wrong.

**Solution:** Use this exact signature:

```rust
pub async fn handler_name(req: HttpRequest) -> HttpResponse {
    // ...
}
```

### "DLL won't reload"

**Cause:** DLLs are locked while the app is running.

**Solution:** Stop the app (`Ctrl+C`), rebuild, then restart.

### Slow First Build

**Cause:** Rust compiling dependencies.

**Solution:** This is normal for the first build. Subsequent builds are faster.

### "cargo: command not found"

**Cause:** Rust not installed or not in PATH.

**Solution:** Install Rust from [rustup.rs](https://rustup.rs/) and restart your terminal.

### "bun: command not found"

**Cause:** Bun not installed or not in PATH.

**Solution:** Install Bun from [bun.sh](https://bun.sh/) and restart your terminal.
