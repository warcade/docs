# App Configuration

Configure your WebArcade application by editing the `app/Cargo.toml` file.

## Configuration File Location

```
my-app/
└── app/
    └── Cargo.toml      ← Edit this file
```

## Basic Configuration

Here's a typical configuration:

```toml
[package]
name = "my-app"
version = "1.0.0"
description = "My awesome desktop application"
authors = ["Your Name <you@example.com>"]
edition = "2021"

[package.metadata.packager]
product-name = "My App"
identifier = "com.yourcompany.myapp"
icons = ["icon.ico", "icon.png"]
```

## Configuration Options Explained

### Package Section

The `[package]` section controls the Rust build:

```toml
[package]
name = "my-app"                 # Executable filename (my-app.exe)
version = "1.0.0"              # App version
description = "Description"     # App description
authors = ["Name <email>"]      # Author(s)
edition = "2021"               # Rust edition (don't change)
```

#### `name`

The executable filename. Use lowercase with hyphens:

```toml
name = "my-app"        # Creates: my-app.exe
name = "code-editor"   # Creates: code-editor.exe
```

::: warning
Don't use spaces or special characters in the name.
:::

#### `version`

Semantic version number:

```toml
version = "1.0.0"      # Major.Minor.Patch
version = "2.1.3"
```

#### `description`

A brief description of your app:

```toml
description = "A lightweight code editor with plugin support"
```

#### `authors`

One or more authors:

```toml
authors = ["Your Name <your@email.com>"]
authors = ["Alice <alice@example.com>", "Bob <bob@example.com>"]
```

### Packager Section

The `[package.metadata.packager]` section controls the installer:

```toml
[package.metadata.packager]
product-name = "My App"
identifier = "com.yourcompany.myapp"
icons = ["icon.ico", "icon.png"]
copyright = "Copyright © 2024 Your Company"
category = "Utility"
short-description = "Brief description for installers"
```

#### `product-name`

The display name shown to users. Can include spaces:

```toml
product-name = "My App"
product-name = "Code Editor Pro"
product-name = "Super Note Taker 3000"
```

This appears in:
- Window title
- Start menu
- Add/Remove Programs
- About dialogs

#### `identifier`

A unique identifier in reverse domain format:

```toml
identifier = "com.yourcompany.myapp"
identifier = "io.github.username.myapp"
```

Used for:
- OS app identification
- Preventing multiple instances
- Data storage locations

::: tip
Use a domain you own, or `io.github.username` if using GitHub.
:::

#### `icons`

App icon files:

```toml
icons = ["icon.ico", "icon.png"]
icons = ["icon.png"]  # PNG will be converted to ICO
```

Place your icon files in the `app/` folder:

```
app/
├── Cargo.toml
├── icon.png          ← Your icon (512x512 recommended)
└── icon.ico          ← Auto-generated on build
```

::: tip Icon Size
Use a 512x512 or 1024x1024 PNG for best quality. The build process creates smaller sizes automatically.
:::

#### `copyright`

Copyright notice:

```toml
copyright = "Copyright © 2024 Your Company"
copyright = "Copyright © 2024 Alice Smith. All rights reserved."
```

#### `category`

Application category (used on macOS):

```toml
category = "Utility"
category = "DeveloperTool"
category = "Productivity"
category = "GraphicsDesign"
```

Common categories:
| Category | Description |
|----------|-------------|
| `Utility` | General utilities |
| `DeveloperTool` | Development tools |
| `Productivity` | Productivity apps |
| `GraphicsDesign` | Graphics/design tools |
| `Music` | Audio applications |
| `Video` | Video applications |
| `Education` | Educational apps |
| `Game` | Games |

#### `short-description`

Brief description for installers:

```toml
short-description = "A lightweight, fast code editor"
```

Keep it under 100 characters.

## Complete Example

Here's a complete, well-configured `Cargo.toml`:

```toml
[package]
name = "code-editor"
version = "2.1.0"
description = "A lightweight code editor with plugin support and real-time collaboration"
authors = ["Your Team <team@example.com>"]
edition = "2021"

[package.metadata.packager]
product-name = "Code Editor"
identifier = "com.yourteam.codeeditor"
icons = ["icon.ico", "icon.png"]
copyright = "Copyright © 2024 Your Team. All rights reserved."
category = "DeveloperTool"
short-description = "Fast, lightweight code editor with plugins"

# Don't modify below this line unless you know what you're doing
[dependencies]
# ... (managed by WebArcade)

[build-dependencies]
# ... (managed by WebArcade)
```

## App Icon

### Creating an Icon

1. Create a PNG image (512x512 or 1024x1024 pixels)
2. Save it as `app/icon.png`

### Icon Requirements

| Property | Recommendation |
|----------|----------------|
| Size | 512x512 or 1024x1024 pixels |
| Format | PNG with transparency |
| Shape | Square, content centered |
| Margins | 10-15% padding from edges |

### Automatic Conversion

When you run `webarcade app`, the build script:
1. Reads `icon.png`
2. Creates `icon.ico` (Windows format)
3. Creates various sizes for different uses

## Build Commands

```bash
# Build for development (debug mode)
webarcade dev

# Build for production (optimized)
webarcade app

# Build with embedded plugins
webarcade app --locked

# Interactive packaging
webarcade package
```

## Build Output

After running `webarcade app`:

```
app/target/release/
├── code-editor.exe           # Your application
└── code-editor_x64_setup.exe # Windows installer (if enabled)
```

## Troubleshooting

### Icon not showing

1. Make sure `icon.png` exists in `app/`
2. Check the `icons` field in `Cargo.toml`
3. Rebuild with `webarcade app`

### Name not changing

1. Clean the build: `cargo clean` in the `app/` folder
2. Rebuild: `webarcade app`

### Version not updating

The version in `Cargo.toml` is baked into the build. Make sure to:
1. Update the version in `Cargo.toml`
2. Rebuild with `webarcade app`
