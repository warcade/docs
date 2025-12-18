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

## Basic Plugin Structure

```jsx
import { plugin } from 'webarcade';

export default plugin({
    id: 'my-plugin',
    name: 'My Plugin',
    version: '1.0.0',

    start(api) {
        // Register components using api.register()
        api.register('main-view', {
            type: 'panel',
            component: MainView,
            label: 'Main'
        });

        // Register toolbar items
        api.register('save-btn', {
            type: 'toolbar',
            icon: IconSave,
            label: 'Save',
            onClick: () => save()
        });

        // Register keyboard shortcuts
        api.shortcut({
            'ctrl+s': () => save(),
            'ctrl+n': () => newFile()
        });
    },

    stop(api) {
        // Cleanup when plugin is unloaded
    }
});
```

## Plugin API

### Component Registration

Use `api.register()` to add components to the registry:

```jsx
// Panel component
api.register('explorer', {
    type: 'panel',
    component: Explorer,
    label: 'Explorer',
    icon: IconFolder
});

// Toolbar button
api.register('save-btn', {
    type: 'toolbar',
    icon: IconSave,
    onClick: () => saveFile()
});

// Menu
api.register('file-menu', {
    type: 'menu',
    label: 'File',
    submenu: [
        { id: 'new', label: 'New', action: () => newFile() },
        { id: 'save', label: 'Save', action: () => saveFile() }
    ]
});

// Status bar item
api.register('line-info', {
    type: 'status',
    component: LineInfo,
    align: 'right'
});
```

### Slot Control

Control component visibility:

```jsx
api.slot('explorer').show();
api.slot('explorer').hide();
api.slot('explorer').toggle();
api.slot('explorer').focus();
```

### Layout Management

Switch between layouts:

```jsx
api.layout.setActive('material-editor');
api.layout.back();
api.layout.fullscreen(true);
```

### Keyboard Shortcuts

```jsx
// Convenience method
api.shortcut({
    'ctrl+s': () => save(),
    'ctrl+shift+p': () => openPalette()
});

// Full API
const unregister = api.shortcut.register((event) => {
    if (api.shortcut.matches(event, 'ctrl+s')) {
        event.preventDefault();
        save();
    }
});
```

### Context Menus

```jsx
api.context({
    context: 'file-tree',
    label: 'Open',
    icon: IconFile,
    action: (data) => openFile(data.path)
});
```

### Events

```jsx
// Emit events
api.emit('file-saved', { path: '/my/file.txt' });

// Listen for events
const unsubscribe = api.on('file-saved', (data) => {
    console.log('File saved:', data.path);
});
```

### Inter-Plugin Services

```jsx
// Provide a service
api.provide('audio', {
    play: (sound) => { /* ... */ },
    stop: () => { /* ... */ }
});

// Use a service
const audio = await api.use('audio');
audio.play('click');
```

### Shared Store

```jsx
// Set values
api.set('settings.theme', 'dark');

// Get values
const theme = api.get('settings.theme', 'light');

// Watch for changes
api.watch('settings.theme', (newValue) => {
    applyTheme(newValue);
});

// Reactive selector for components
const theme = api.selector('settings.theme');
return <div class={theme()}>...</div>;
```

### Contracts

Enable cross-plugin component discovery:

```jsx
api.register('file-browser', {
    type: 'panel',
    component: FileBrowser,
    contracts: {
        provides: ['file-browser', 'tree-view'],
        accepts: ['file-selection'],
        emits: ['file-opened']
    }
});

// Find components by contract
const browsers = api.findByContract({ provides: 'file-browser' });
```

## Topics

- [Plugin Lifecycle](/plugins/plugin-lifecycle) - Lifecycle hooks explained
- [Component Registry](/api/registry) - Component types and contracts
- [Layout Manager](/api/layout-manager) - Dynamic layouts
- [Bridge API](/api/bridge-api) - Inter-plugin communication
- [HTTP API](/api/http-api) - Backend communication
