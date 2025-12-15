# Project Structure

This page explains every folder and file in a WebArcade project.

## Overview

```
my-app/
├── src/                    # Frontend source (SolidJS)
├── app/                    # Desktop runtime (Rust)
├── plugins/                # Your plugins
├── build/                  # Build output (generated)
├── node_modules/           # Dependencies (generated)
├── package.json            # Frontend configuration
└── README.md               # Project readme
```

## Detailed Structure

### `src/` - Frontend Source

The SolidJS frontend that runs in the WebView:

```
src/
├── api/                    # APIs for plugins
│   ├── plugin/            # Plugin system
│   │   ├── index.jsx      # Plugin registration API
│   │   ├── Plugin.jsx     # Plugin component
│   │   ├── registry.jsx   # Component registry
│   │   └── bridge.js      # Inter-plugin communication
│   └── layout/            # Layout manager
│       ├── index.jsx      # Layout management API
│       └── LayoutRenderer.jsx # Layout rendering
├── components/             # Shared components
│   ├── layout/            # Layout primitives
│   │   ├── Row.jsx        # Horizontal layout
│   │   ├── Column.jsx     # Vertical layout
│   │   └── Slot.jsx       # Component slots
│   └── ui/                # UI primitives
│       ├── ContextMenu.jsx # Context menus
│       └── PanelResizer.jsx # Panel resize handles
├── layouts/               # Built-in layouts
│   └── DefaultLayout.jsx  # Default application layout
├── App.jsx                 # Root component
├── entry-client.jsx        # Entry point
└── index.css               # Global styles
```

::: danger Don't Modify
Don't modify files in `src/` unless you know what you're doing. These are the core WebArcade files. Your code goes in `plugins/`.
:::

### `app/` - Desktop Runtime

The Rust application that creates the window and runs the frontend:

```
app/
├── src/                    # Rust source code
│   ├── main.rs            # Application entry point
│   ├── bridge.rs          # HTTP/WebSocket bridge
│   └── ...                # Other runtime files
├── dist/                   # Built frontend (generated)
├── plugins/                # Production plugins (generated)
├── icon.png                # Your app icon
├── icon.ico                # Generated Windows icon
├── Cargo.toml              # App configuration ← EDIT THIS
├── Cargo.lock              # Dependency lock (generated)
└── target/                 # Rust build output (generated)
```

::: tip
The only file you should edit here is `Cargo.toml` to configure your app's name, version, and icon.
:::

### `plugins/` - Your Plugins

This is where your code lives:

```
plugins/
├── hello-world/            # Example plugin
│   └── index.jsx          # Plugin entry point
├── my-plugin/              # Your plugin
│   ├── index.jsx          # Plugin entry point (required)
│   ├── components.jsx     # Additional components
│   └── styles.css         # Plugin styles
└── full-stack-plugin/      # Plugin with Rust backend
    ├── index.jsx          # Frontend entry point
    ├── Cargo.toml         # Rust configuration & routes
    ├── mod.rs             # Plugin metadata
    └── router.rs          # HTTP handlers
```

::: tip
This is where you spend most of your time! Create new plugins here.
:::

### `build/` - Build Output

Generated when you run `webarcade build`:

```
build/
└── plugins/
    ├── hello-world.js      # Built frontend-only plugin
    ├── my-plugin.js        # Built frontend-only plugin
    ├── full-stack.js       # Built full-stack plugin (JS part)
    └── full-stack.dll      # Built full-stack plugin (Rust part)
```

::: warning
Don't edit files here - they're overwritten on each build.
:::

### `package.json` - Frontend Configuration

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "build": "...",         // Build frontend
    "build:prod": "...",    // Production build
    "dev": "..."            // Development mode
  },
  "dependencies": {
    "solid-js": "^1.9.7"    // SolidJS framework
  },
  "devDependencies": {
    "tailwindcss": "...",   // Styling
    "daisyui": "...",       // UI components
    "esbuild": "..."        // Bundler
  }
}
```

You might edit this to:
- Add npm dependencies for your plugins
- Update versions

## Plugin Structure Details

### Frontend-Only Plugin

The simplest plugin type:

```
plugins/my-plugin/
└── index.jsx               # Everything in one file
```

Or with multiple files:

```
plugins/my-plugin/
├── index.jsx               # Entry point (required)
├── components/             # Component folder
│   ├── MainView.jsx       # Main view component
│   ├── Sidebar.jsx        # Sidebar component
│   └── Footer.jsx         # Footer component
├── hooks/                  # Custom hooks
│   └── useData.js         # Data fetching hook
└── utils/                  # Utilities
    └── helpers.js         # Helper functions
```

### Full-Stack Plugin

Plugin with a Rust backend:

```
plugins/my-plugin/
├── index.jsx               # Frontend entry (required)
├── components/             # Frontend components
│   └── ...
├── Cargo.toml              # Rust config & routes (required)
├── mod.rs                  # Plugin metadata (required)
└── router.rs               # HTTP handlers (required)
```

#### `Cargo.toml` (Full-Stack)

```toml
[package]
name = "my-plugin"
version = "1.0.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
webarcade-api = { version = "0.1", features = ["bridge"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"

# Route definitions
[routes]
"GET /hello" = "handle_hello"
"POST /data" = "handle_data"
"GET /items/:id" = "handle_get_item"
```

#### `mod.rs` (Full-Stack)

```rust
use api::{Plugin, PluginMetadata};

pub struct MyPlugin;

impl Plugin for MyPlugin {
    fn metadata(&self) -> PluginMetadata {
        PluginMetadata {
            id: "my-plugin".into(),
            name: "My Plugin".into(),
            version: "1.0.0".into(),
            description: "Does something cool".into(),
            author: "Your Name".into(),
            dependencies: vec![],
        }
    }
}
```

#### `router.rs` (Full-Stack)

```rust
use api::{HttpRequest, HttpResponse, json, json_response};

pub async fn handle_hello(_req: HttpRequest) -> HttpResponse {
    json_response(&json!({
        "message": "Hello from Rust!"
    }))
}

pub async fn handle_get_item(req: HttpRequest) -> HttpResponse {
    let id = req.path_params.get("id").unwrap();
    json_response(&json!({ "id": id }))
}
```

## What to Edit vs. What Not to Edit

| Path | Edit? | Purpose |
|------|-------|---------|
| `plugins/` | ✅ Yes | Your plugin code |
| `app/Cargo.toml` | ✅ Yes | App configuration |
| `app/icon.png` | ✅ Yes | App icon |
| `package.json` | ⚠️ Careful | Add dependencies only |
| `src/` | ❌ No | Core WebArcade code |
| `app/src/` | ❌ No | Core runtime code |
| `build/` | ❌ No | Generated files |
| `node_modules/` | ❌ No | Generated files |

## File Size Guide

Typical file sizes for reference:

| Item | Typical Size |
|------|--------------|
| Built runtime (`app.exe`) | ~2.5 MB |
| Frontend plugin (`.js`) | 5-100 KB |
| Full-stack plugin (`.dll`) | 100-500 KB |
| Total app (unlocked) | ~3-5 MB |
| Total app (locked) | ~2.5-3.5 MB |
