# Plugin API

The Plugin API is used to register UI components and control the application.

## Creating a Plugin

```jsx
import { plugin } from '@/api/plugin';

export default plugin({
    id: 'my-plugin',
    name: 'My Plugin',
    version: '1.0.0',

    start(api) { /* Called once when plugin loads */ },
    stop(api) { /* Called when plugin unloads */ }
});
```

## api.register()

Register components to the application.

```jsx
api.register(id: string, options: RegisterOptions): string
```

Returns the full component ID (`pluginId:componentId`).

### Options

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `'panel' \| 'toolbar' \| 'menu' \| 'status'` | Yes | Component type |
| `component` | `Component` | For panel/status | SolidJS component |
| `label` | `string` | No | Display label |
| `icon` | `Component` | No | Icon component |
| `order` | `number` | No | Sort order (default: `0`) |

### Panel Options

| Property | Type | Description |
|----------|------|-------------|
| `closable` | `boolean` | Can user close this (default: `true`) |
| `onMount` | `() => void` | Called when panel mounts |
| `onUnmount` | `() => void` | Called when panel unmounts |
| `onFocus` | `() => void` | Called when panel receives focus |
| `onBlur` | `() => void` | Called when panel loses focus |
| `contracts` | `object` | Contract definitions for discovery |

### Toolbar Options

| Property | Type | Description |
|----------|------|-------------|
| `tooltip` | `string` | Hover tooltip |
| `group` | `string` | Group ID |
| `onClick` | `() => void` | Click handler |
| `active` | `() => boolean` | Active state (reactive) |
| `disabled` | `() => boolean` | Disabled state (reactive) |
| `separator` | `boolean` | Add separator after |

### Menu Options

| Property | Type | Description |
|----------|------|-------------|
| `submenu` | `MenuItem[]` | Menu items |

### Status Options

| Property | Type | Description |
|----------|------|-------------|
| `align` | `'left' \| 'right'` | Alignment (default: `'left'`) |
| `priority` | `number` | Sort order within alignment |

### Examples

```jsx
// Panel
api.register('editor', {
    type: 'panel',
    component: EditorView,
    label: 'Editor',
    icon: IconCode,
    closable: true,
    onMount: () => console.log('Mounted'),
    contracts: {
        provides: ['text-editor'],
        accepts: ['file-selection'],
        emits: ['file-saved']
    }
});

// Toolbar button
api.register('save-btn', {
    type: 'toolbar',
    icon: IconSave,
    tooltip: 'Save (Ctrl+S)',
    group: 'file-group',
    onClick: () => saveFile(),
    disabled: () => isReadOnly()
});

// Menu
api.register('file-menu', {
    type: 'menu',
    label: 'File',
    order: 1,
    submenu: [
        { id: 'new', label: 'New', shortcut: 'Ctrl+N', action: () => newFile() },
        { id: 'open', label: 'Open', shortcut: 'Ctrl+O', action: () => openFile() },
        { divider: true },
        { id: 'save', label: 'Save', shortcut: 'Ctrl+S', action: () => saveFile() }
    ]
});

// Status bar
api.register('line-info', {
    type: 'status',
    component: () => <span>Ln 1, Col 1</span>,
    align: 'right',
    priority: 100
});
```

## api.unregister()

Remove a registered component.

```jsx
api.unregister(id: string): void
```

```jsx
api.unregister('file-viewer');
```

## Slot Control

Control component visibility with `api.slot()`.

```jsx
api.slot(id: string): SlotController
```

### SlotController Methods

| Method | Description |
|--------|-------------|
| `show()` | Show the component |
| `hide()` | Hide the component |
| `toggle()` | Toggle visibility |
| `focus()` | Focus the component |

```jsx
api.slot('explorer').show();
api.slot('explorer').hide();
api.slot('explorer').toggle();
api.slot('explorer').focus();
```

## Layout Management

Control the layout with `api.layout`.

```jsx
// Switch to a different layout
api.layout.setActive('material-editor');

// Go back to previous layout
api.layout.back();

// Check if can go back
if (api.layout.canGoBack()) {
    api.layout.back();
}

// Get current layout ID
const currentId = api.layout.getActiveId();

// Get all layouts
const layouts = api.layout.getAll();

// Register a custom layout
api.layout.register('custom-layout', {
    name: 'Custom Layout',
    component: CustomLayoutComponent,
    icon: IconLayout
});

// Layout visibility controls
api.layout.fullscreen(true);
api.layout.hideAll();
api.layout.showAll();
```

## Keyboard Shortcuts

### api.shortcut()

Register keyboard shortcuts for your plugin.

```jsx
api.shortcut(shortcuts: Record<string, Function>): Function
```

Returns an unregister function to remove the shortcuts.

### Key Pattern Format

| Pattern | Keys |
|---------|------|
| `'ctrl+s'` | Ctrl + S (Cmd + S on Mac) |
| `'shift+a'` | Shift + A |
| `'ctrl+shift+z'` | Ctrl + Shift + Z |
| `'alt+enter'` | Alt + Enter |
| `'escape'` | Escape |
| `'f1'` | F1 |

### Example

```jsx
start(api) {
    // Register shortcuts
    const unregister = api.shortcut({
        'ctrl+s': () => this.save(),
        'ctrl+z': () => this.undo(),
        'ctrl+shift+z': () => this.redo(),
        'ctrl+f': () => this.openSearch(),
        'escape': () => this.closeDialog()
    });

    // Store unregister function for cleanup
    this.unregisterShortcuts = unregister;
}

stop(api) {
    // Clean up shortcuts when plugin stops
    this.unregisterShortcuts?.();
}
```

::: tip
Shortcuts are automatically disabled when the user is typing in an input field, textarea, or code editor.
:::

## Context Menu

### api.context()

Register a context menu item that appears on right-click.

```jsx
api.context(options: ContextOptions): Function
```

Returns an unregister function to remove the menu item.

### Options

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `label` | `string` | Yes | Display text |
| `action` | `(data, context) => void` | Yes | Click handler |
| `context` | `string` | No | Where to show (default: `'global'`) |
| `icon` | `Component` | No | Icon component |
| `order` | `number` | No | Sort order (lower = higher in menu) |
| `separator` | `boolean` | No | Render as a separator line |
| `submenu` | `ContextOptions[]` | No | Nested submenu items |

### Example

```jsx
start(api) {
    // Add a menu item
    api.context({
        label: 'Copy',
        action: (data) => this.copy(data),
        context: 'viewport',
        order: 10,
        icon: IconCopy
    });

    // Add a separator
    api.context({
        separator: true,
        context: 'viewport',
        order: 15
    });

    // Add item with submenu
    api.context({
        label: 'Export',
        context: 'viewport',
        order: 20,
        submenu: [
            { label: 'As PNG', action: () => this.exportPNG() },
            { label: 'As JPG', action: () => this.exportJPG() },
            { label: 'As PDF', action: () => this.exportPDF() }
        ]
    });
}
```

## Events

### api.emit()

Emit an event for other plugins to receive.

```jsx
api.emit(event: string, data?: any): void
```

```jsx
api.emit('file-saved', { path: '/path/to/file.txt' });
```

### api.on()

Listen for events from other plugins.

```jsx
api.on(event: string, handler: (data) => void): Function
```

Returns an unsubscribe function.

```jsx
const unsubscribe = api.on('file-saved', (data) => {
    console.log('File saved:', data.path);
});

// Later: unsubscribe()
```

## Contract Discovery

### api.findByContract()

Find components by their contracts.

```jsx
api.findByContract(query: ContractQuery): Component[]
```

```jsx
// Find all file browsers
const browsers = api.findByContract({ provides: 'file-browser' });

// Find components that accept file selection
const editors = api.findByContract({ accepts: 'file-selection' });

// Find components that emit file events
const emitters = api.findByContract({ emits: 'file-opened' });
```

## Services

### api.provide()

Provide a service for other plugins to use.

```jsx
api.provide(name: string, service: any): void
```

```jsx
api.provide('audio', {
    play: (sound) => { /* ... */ },
    stop: () => { /* ... */ },
    setVolume: (v) => { /* ... */ }
});
```

### api.use()

Use a service provided by another plugin.

```jsx
api.use(name: string): Promise<any>
```

```jsx
const audio = await api.use('audio');
audio.play('click');
```

## Shared Store

### api.set()

Set a value in the shared store.

```jsx
api.set(key: string, value: any): void
```

```jsx
api.set('settings.theme', 'dark');
api.set('player.health', 100);
```

### api.get()

Get a value from the shared store.

```jsx
api.get(key: string, defaultValue?: any): any
```

```jsx
const theme = api.get('settings.theme', 'light');
```

### api.has()

Check if a key exists in the store.

```jsx
api.has(key: string): boolean
```

### api.watch()

Watch for changes to a value.

```jsx
api.watch(key: string, handler: (value) => void): Function
```

Returns an unsubscribe function.

```jsx
const unsubscribe = api.watch('settings.theme', (theme) => {
    applyTheme(theme);
});
```

### api.selector()

Get a reactive signal for use in SolidJS components.

```jsx
api.selector(key: string, defaultValue?: any): Accessor
```

```jsx
function ThemeDisplay() {
    const theme = api.selector('settings.theme', 'light');
    return <div>Current theme: {theme()}</div>;
}
```

## HTTP Requests

### api()

Make HTTP requests to plugin backends.

```jsx
import { api } from '@/api/plugin';

api(endpoint: string, options?: RequestInit): Promise<Response>
```

```jsx
// GET request
const response = await api('my-plugin/data');
const data = await response.json();

// POST request
await api('my-plugin/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'test' })
});
```

## Complete Example

```jsx
import { plugin } from '@/api/plugin';
import { createSignal } from 'solid-js';
import { IconCode, IconSave, IconFolder } from '@tabler/icons-solidjs';

const [files, setFiles] = createSignal([]);

function Editor() {
    return <div class="p-4">Editor content</div>;
}

function FileTree() {
    return <div class="p-2">File tree</div>;
}

export default plugin({
    id: 'code-editor',
    name: 'Code Editor',
    version: '1.0.0',

    start(api) {
        // Register panels
        api.register('editor', {
            type: 'panel',
            component: Editor,
            label: 'Editor',
            icon: IconCode,
            contracts: {
                provides: ['text-editor'],
                accepts: ['file-selection']
            }
        });

        api.register('file-tree', {
            type: 'panel',
            component: FileTree,
            label: 'Files',
            icon: IconFolder
        });

        // Register toolbar
        api.register('save-btn', {
            type: 'toolbar',
            icon: IconSave,
            tooltip: 'Save (Ctrl+S)',
            onClick: () => saveFile()
        });

        // Register menu
        api.register('file-menu', {
            type: 'menu',
            label: 'File',
            submenu: [
                { id: 'save', label: 'Save', shortcut: 'Ctrl+S', action: () => saveFile() }
            ]
        });

        // Register status
        api.register('status', {
            type: 'status',
            component: () => <span>Ready</span>,
            align: 'left'
        });

        // Register shortcuts
        api.shortcut({
            'ctrl+s': () => saveFile(),
            'ctrl+b': () => api.slot('file-tree').toggle()
        });

        // Provide service
        api.provide('editor', {
            openFile: (path) => openFile(path),
            save: () => saveFile()
        });
    },

    stop(api) {
        // Cleanup
    }
});
```
