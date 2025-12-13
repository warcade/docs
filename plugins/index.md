# Plugin Development

Plugins are the building blocks of WebArcade applications. Each plugin can contribute UI components, backend functionality, and services for other plugins.

## Plugin Types

### Frontend-Only Plugins

Simple plugins that only have UI components:

```
plugins/my-plugin/
├── index.jsx           # Entry point
└── components.jsx      # UI components
```

Build output: `my-plugin.js`

### Full-Stack Plugins

Plugins with both frontend and Rust backend:

```
plugins/my-plugin/
├── index.jsx           # Frontend entry
├── Cargo.toml          # Routes & config
├── mod.rs              # Plugin metadata
└── router.rs           # HTTP handlers
```

Build output: `my-plugin.js` + `my-plugin.dll`

## Quick Start

```bash
# Create a frontend-only plugin
webarcade new my-plugin --frontend-only

# Create a full-stack plugin
webarcade new my-plugin

# Build the plugin
webarcade build my-plugin

# Build all plugins
webarcade build --all
```

## Topics

- [Creating Plugins](/plugins/creating-plugins) - Step-by-step guide
- [Plugin Lifecycle](/plugins/plugin-lifecycle) - Lifecycle hooks explained
- [Panel System](/plugins/panels) - Viewport, sidebars, and more
- [Toolbar & Menus](/plugins/toolbar-menu) - Adding toolbar buttons and menus
- [Shared Components](/plugins/shared-components) - Cross-plugin component sharing
