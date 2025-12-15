# Guide

This guide covers the core concepts you need to understand to build WebArcade applications.

## Core Concepts

### What is a Plugin?

A **plugin** is a self-contained unit of functionality. Each plugin can:

- Display its own UI in the main window
- Register panels, toolbar buttons, menus, and status items
- Communicate with other plugins
- Have its own backend (Rust code)

Think of plugins like apps within your app. Each plugin is independent but they can work together.

### What is the Runtime?

The **runtime** is the WebArcade application that loads and manages plugins. It provides:

- **Window management** - Creates and manages the application window
- **Plugin discovery** - Finds and loads plugins from the `plugins/` folder
- **Layout system** - Dynamic layouts with panels, toolbar, menu, and status bar
- **Component registry** - Central registry for all UI components
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

### Component Types

```
┌─────────────────────────────────────────────────────────────┐
│  Menu         ← api.register({ type: 'menu' })              │
├─────────────────────────────────────────────────────────────┤
│  Toolbar      ← api.register({ type: 'toolbar' })           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┬─────────────────────────┬──────────┐          │
│  │  Left    │        Viewport         │  Right   │          │
│  │  Panel   │                         │  Panel   │          │
│  │          │    api.register({       │          │          │
│  │          │      type: 'panel',     │          │          │
│  │          │      component: View    │          │          │
│  │          │    })                   │          │          │
│  │          │                         │          │          │
│  ├──────────┴─────────────────────────┴──────────┤          │
│  │       Bottom Panel                            │          │
│  └───────────────────────────────────────────────┘          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Status Bar  ← api.register({ type: 'status' })             │
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
        api.register('main-view', {
            type: 'panel',
            component: MainView,
            label: 'Main'
        });
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
| `api.register()` | Register a component (panel, toolbar, menu, status) |
| `api.unregister()` | Remove a registered component |
| `api.slot().show()` | Show a component |
| `api.slot().hide()` | Hide a component |
| `api.slot().toggle()` | Toggle component visibility |
| `api.slot().focus()` | Focus a component |
| `api.layout.setActive()` | Switch to a different layout |
| `api.layout.back()` | Go back to previous layout |
| `api.shortcut()` | Register keyboard shortcuts |
| `api.context()` | Register context menu items |
| `api.provide()` | Provide a service for other plugins |
| `api.use()` | Use a service from another plugin |
| `api.emit()` | Emit an event |
| `api.on()` | Listen for events |
| `api.set()` | Set shared state |
| `api.get()` | Get shared state |
| `api.watch()` | Watch for state changes |
| `api.selector()` | Get reactive state (SolidJS) |
