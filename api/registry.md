# Component Registry

The Component Registry is a contract-based system for registering and discovering UI components across plugins. It provides granular reactivity using SolidJS stores.

## Overview

Components are registered with a type and optional contracts that describe their capabilities:

```jsx
api.register('file-explorer', {
    type: 'panel',
    component: FileExplorer,
    label: 'Explorer',
    contracts: {
        provides: ['file-browser', 'tree-view'],
        accepts: ['file-selection'],
        emits: ['file-opened', 'file-deleted']
    }
});
```

## Component Types

The registry supports four component types:

```jsx
import { ComponentType } from 'webarcade';

ComponentType.PANEL    // 'panel' - Side panels, viewports
ComponentType.TOOLBAR  // 'toolbar' - Toolbar buttons
ComponentType.MENU     // 'menu' - Top menu items
ComponentType.STATUS   // 'status' - Status bar items
```

### Panel Components

Panels are the primary content containers - sidebars, viewports, bottom panels.

```jsx
api.register('explorer', {
    type: 'panel',
    component: Explorer,
    label: 'Explorer',
    icon: IconFolder,
    order: 1,
    closable: true,
    onMount: () => console.log('Explorer mounted'),
    onUnmount: () => console.log('Explorer unmounted'),
    onFocus: () => console.log('Explorer focused'),
    onBlur: () => console.log('Explorer blurred')
});
```

**Panel-specific options:**

| Option | Type | Description |
|--------|------|-------------|
| `closable` | `boolean` | Can the user close this panel (default: true) |
| `onMount` | `function` | Called when panel is first mounted |
| `onUnmount` | `function` | Called when panel is unmounted |
| `onFocus` | `function` | Called when panel receives focus |
| `onBlur` | `function` | Called when panel loses focus |

### Toolbar Components

Toolbar items are buttons, dropdowns, or custom components in the toolbar.

```jsx
api.register('save-btn', {
    type: 'toolbar',
    icon: IconSave,
    label: 'Save',
    tooltip: 'Save file (Ctrl+S)',
    group: 'file-group',
    order: 1,
    onClick: () => saveFile(),
    disabled: () => isReadOnly(),
    active: () => hasUnsavedChanges(),
    separator: true  // Add separator after this button
});

// Custom toolbar component
api.register('zoom-slider', {
    type: 'toolbar',
    component: ZoomSlider,
    group: 'view-group'
});
```

**Toolbar-specific options:**

| Option | Type | Description |
|--------|------|-------------|
| `tooltip` | `string` | Hover tooltip text |
| `onClick` | `function` | Click handler |
| `disabled` | `function` | Returns true if button should be disabled |
| `active` | `function` | Returns true if button should be highlighted |
| `separator` | `boolean` | Add separator after this button |
| `group` | `string` | Toolbar group ID (default: 'default') |

### Menu Components

Menu items for the top menu bar.

```jsx
api.register('file-menu', {
    type: 'menu',
    label: 'File',
    order: 1,
    submenu: [
        { id: 'new', label: 'New', icon: IconFile, shortcut: 'Ctrl+N', action: () => newFile() },
        { id: 'open', label: 'Open', icon: IconFolder, shortcut: 'Ctrl+O', action: () => openFile() },
        { divider: true },
        { id: 'save', label: 'Save', shortcut: 'Ctrl+S', action: () => saveFile() },
        {
            id: 'export',
            label: 'Export',
            submenu: [
                { id: 'pdf', label: 'As PDF', action: () => exportPDF() },
                { id: 'png', label: 'As PNG', action: () => exportPNG() }
            ]
        }
    ]
});
```

**Menu item properties:**

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique item ID |
| `label` | `string` | Display text |
| `icon` | `Component` | Optional icon |
| `shortcut` | `string` | Keyboard shortcut display |
| `action` | `function` | Click handler |
| `submenu` | `array` | Nested submenu items |
| `divider` | `boolean` | Render as separator |

### Status Components

Status bar items displayed at the bottom of the window.

```jsx
api.register('line-info', {
    type: 'status',
    component: () => <span>Ln 42, Col 15</span>,
    align: 'right',
    priority: 100
});

api.register('git-branch', {
    type: 'status',
    component: GitBranchIndicator,
    align: 'left',
    priority: 50
});
```

**Status-specific options:**

| Option | Type | Description |
|--------|------|-------------|
| `align` | `string` | 'left' or 'right' (default: 'left') |
| `priority` | `number` | Sort order within alignment |

## Contracts

Contracts enable cross-plugin communication by declaring capabilities.

### Contract Types

| Contract | Description |
|----------|-------------|
| `provides` | What this component offers to others |
| `accepts` | What this component can receive |
| `emits` | Events this component publishes |

### Registering with Contracts

```jsx
api.register('file-explorer', {
    type: 'panel',
    component: FileExplorer,
    label: 'Files',
    contracts: {
        provides: ['file-browser', 'tree-view'],
        accepts: ['file-selection', 'file-filter'],
        emits: ['file-opened', 'file-deleted', 'file-renamed']
    }
});
```

### Finding Components by Contract

```jsx
// Find all components that provide 'file-browser'
const fileBrowsers = api.findByContract({ provides: 'file-browser' });

// Find components that accept 'file-selection'
const selectable = api.findByContract({ accepts: 'file-selection' });

// Find components that emit 'file-opened'
const fileOpeners = api.findByContract({ emits: 'file-opened' });
```

### Checking Contracts

```jsx
import { componentRegistry } from 'webarcade';

// Check if a component provides a contract
if (componentRegistry.provides('my-plugin:file-explorer', 'file-browser')) {
    // Use the file browser
}

// Check if a component accepts a contract
if (componentRegistry.accepts('my-plugin:editor', 'file-selection')) {
    // Send file selection
}
```

## Component IDs

Components are identified by a full ID in the format `pluginId:componentId`:

```jsx
// Plugin 'editor' registers component 'file-explorer'
// Full ID: 'editor:file-explorer'

const component = api.getComponent('editor:file-explorer');
```

## Registry API

### Direct Registry Access

```jsx
import { componentRegistry } from 'webarcade';

// Get all components
const all = componentRegistry.getAll();

// Get components by type
const panels = componentRegistry.getByType('panel');
const toolbars = componentRegistry.getByType('toolbar');

// Get components by plugin
const myComponents = componentRegistry.getByPlugin('my-plugin');

// Get specific component
const explorer = componentRegistry.get('my-plugin:explorer');

// Get multiple components
const components = componentRegistry.getMany([
    'my-plugin:explorer',
    'my-plugin:editor'
]);

// Get the raw SolidJS store (for reactive access)
const store = componentRegistry.getStore();
```

### Plugin API Registration

```jsx
// Register
const fullId = api.register('explorer', {
    type: 'panel',
    component: Explorer
});
// Returns: 'my-plugin:explorer'

// Unregister
api.unregister('explorer');
```

## Reactive Usage in Components

The registry uses SolidJS stores for granular reactivity:

```jsx
import { componentRegistry } from 'webarcade';
import { For, createMemo } from 'solid-js';

function ToolbarRenderer() {
    const toolbarItems = createMemo(() =>
        componentRegistry.getByType('toolbar')
            .sort((a, b) => a.order - b.order)
    );

    return (
        <div class="toolbar">
            <For each={toolbarItems()}>
                {(item) => (
                    <button
                        onClick={item.onClick}
                        disabled={item.disabled?.()}
                        class={item.active?.() ? 'active' : ''}
                        title={item.tooltip}
                    >
                        <Dynamic component={item.icon} />
                    </button>
                )}
            </For>
        </div>
    );
}
```

## Contract Index

The registry maintains indexes for fast contract lookups:

```jsx
import { contractIndex } from 'webarcade';

// Direct access to contract indexes
const fileBrowsers = contractIndex.provides['file-browser'];  // Array of fullIds
const acceptors = contractIndex.accepts['file-selection'];    // Array of fullIds
const emitters = contractIndex.emits['file-opened'];          // Array of fullIds
```

## Example: Cross-Plugin Communication

### Plugin A: File Manager

```jsx
export default plugin({
    id: 'file-manager',
    name: 'File Manager',
    version: '1.0.0',

    start(api) {
        api.register('file-tree', {
            type: 'panel',
            component: FileTree,
            label: 'Files',
            contracts: {
                provides: ['file-browser'],
                emits: ['file-selected', 'file-opened']
            }
        });

        // Emit events when files are selected
        const emitFileSelected = (path) => {
            api.publish('file-selected', { path });
        };
    }
});
```

### Plugin B: Editor

```jsx
export default plugin({
    id: 'editor',
    name: 'Editor',
    version: '1.0.0',

    start(api) {
        api.register('code-editor', {
            type: 'panel',
            component: CodeEditor,
            label: 'Editor',
            contracts: {
                accepts: ['file-selection'],
                provides: ['text-editor']
            }
        });

        // Find file browsers and listen to their events
        const browsers = api.findByContract({ provides: 'file-browser' });

        // Subscribe to file selection
        api.subscribe('file-selected', ({ path }) => {
            openFile(path);
        });
    }
});
```

## Best Practices

1. **Use meaningful contract names** - Contracts should describe capabilities clearly
2. **Document your contracts** - Let other plugin authors know what contracts you provide
3. **Keep components focused** - Each component should have a clear, single purpose
4. **Use appropriate types** - Choose the right component type for the use case
5. **Provide fallbacks** - Handle cases where expected contracts aren't available
6. **Clean up on stop** - Components are automatically unregistered, but clean up subscriptions
