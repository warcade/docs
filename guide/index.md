# Guide

This guide covers the core concepts you need to understand to build WebArcade applications.

## Core Concepts

### What is a Plugin?

A **plugin** is a self-contained unit of functionality. Each plugin can:

- Display its own UI in the main window
- Have its own tab in the tab bar
- Add panels to the sidebars
- Add buttons to the toolbar
- Add items to the menu
- Communicate with other plugins
- Have its own backend (Rust code)

Think of plugins like apps within your app. Each plugin is independent but they can work together.

### What is the Runtime?

The **runtime** is the WebArcade application that loads and manages plugins. It provides:

- **Window management** - Creates and manages the application window
- **Plugin discovery** - Finds and loads plugins from the `plugins/` folder
- **Panel system** - The viewport, sidebars, toolbar, menu, and footer
- **Bridge** - Communication between plugins
- **HTTP server** - Serves the frontend and handles backend requests

### What is the Bridge?

The **bridge** is how plugins communicate with each other and with their backends:

```
┌─────────────┐     Bridge     ┌─────────────┐
│  Plugin A   │ ◄────────────► │  Plugin B   │
└─────────────┘                └─────────────┘
       │
       │ Bridge (HTTP)
       ▼
┌─────────────┐
│  Rust DLL   │
│  (backend)  │
└─────────────┘
```

The bridge provides three communication patterns:

| Pattern | What it does | Example |
|---------|--------------|---------|
| **Services** | Share objects | Plugin A provides an `audio` service with `play()` and `stop()` methods |
| **Messages** | Send events | Plugin A publishes "file-saved", Plugin B receives it |
| **Shared Store** | Share state | Both plugins read/write to `settings.theme` |

## Guide Sections

### [Plugin Modes](/guide/plugin-modes)

Learn about the two ways to package your application:

- **Unlocked mode** - Plugins in a separate folder, users can add more
- **Locked mode** - All plugins embedded in the executable

### [App Configuration](/guide/app-configuration)

Configure your application:

- App name and version
- App icon
- Installer settings
- Metadata

### [Project Structure](/guide/project-structure)

Understand the folder structure:

- Where your code goes
- What each folder is for
- What files you should and shouldn't edit

## Quick Reference

### The Panel System

```
┌─────────────────────────────────────────────────────────────┐
│  Menu         ← api.menu()                                  │
├─────────────────────────────────────────────────────────────┤
│  Toolbar      ← api.toolbar()                               │
├─────────────────────────────────────────────────────────────┤
│  Plugin Tabs  ← api.add({ panel: 'tab' })                   │
├──────────┬─────────────────────────────┬────────────────────┤
│  Left    │  Viewport                   │  Right             │
│  Panel   │  ← api.add({                │  Panel             │
│  ←       │      panel: 'viewport'      │  ←                 │
│  api.add │    })                       │  api.add           │
│  ({      │                             │  ({                │
│   panel: │                             │   panel: 'right'   │
│   'left' │                             │  })                │
│  })      │                             │                    │
├──────────┴─────────────────────────────┴────────────────────┤
│  Bottom Panel  ← api.add({ panel: 'bottom' })               │
├─────────────────────────────────────────────────────────────┤
│  Footer        ← api.footer()                               │
└─────────────────────────────────────────────────────────────┘
```

### Lifecycle Hooks

Every plugin has these lifecycle hooks:

```jsx
export default plugin({
    id: 'my-plugin',
    name: 'My Plugin',
    version: '1.0.0',

    // Called ONCE when the plugin loads
    start(api) {
        // Register panels, toolbar buttons, menu items
    },

    // Called each time the user switches TO this plugin
    active(api) {
        // Show panels, refresh data
    },

    // Called each time the user switches AWAY from this plugin
    inactive(api) {
        // Save state, pause operations
    },

    // Called when the plugin is unloaded or app closes
    stop(api) {
        // Clean up resources
    }
});
```

### Key API Methods

| Method | What it does |
|--------|--------------|
| `api.add()` | Add a panel (viewport, left, right, bottom, tab) |
| `api.remove()` | Remove a panel |
| `api.toolbar()` | Add a toolbar button |
| `api.menu()` | Add a menu item |
| `api.footer()` | Add a footer component |
| `api.showLeft()` | Show/hide left panel |
| `api.showRight()` | Show/hide right panel |
| `api.showBottom()` | Show/hide bottom panel |
| `api.provide()` | Provide a service for other plugins |
| `api.use()` | Use a service from another plugin |
| `api.publish()` | Send a message |
| `api.subscribe()` | Receive messages |
| `api.set()` | Set shared state |
| `api.get()` | Get shared state |
| `api.watch()` | Watch for state changes |
