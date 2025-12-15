# Component System

The component system is how you add UI to your plugin. This page explains the component types and how to register them.

## Component Types

WebArcade supports four component types:

| Type | Purpose | Example |
|------|---------|---------|
| `panel` | Content areas (sidebars, viewports) | File explorer, editor, properties |
| `toolbar` | Toolbar buttons | Save, undo, run |
| `menu` | Top menu items | File menu, Edit menu |
| `status` | Status bar items | Line number, git branch |

## Registering Components with `api.register()`

### Basic Syntax

```jsx
api.register('component-id', {
    type: 'panel',           // Required: component type
    component: MyComponent,  // Required for panel/status
    label: 'My Panel',       // Display label
    // ... other options
});
```

## Panel Components

Panels are the primary content containers.

### Basic Panel

```jsx
function MainView() {
    return (
        <div class="p-4">
            <h1>Main Content</h1>
        </div>
    );
}

api.register('main-view', {
    type: 'panel',
    component: MainView,
    label: 'Main',
    icon: IconHome
});
```

### Panel Options

```jsx
api.register('editor', {
    type: 'panel',
    component: EditorView,
    label: 'Editor',
    icon: IconCode,
    order: 1,                  // Sort order (lower = first)
    closable: true,            // Can user close this? (default: true)

    // Lifecycle hooks
    onMount: () => console.log('Mounted'),
    onUnmount: () => console.log('Unmounted'),
    onFocus: () => console.log('Focused'),
    onBlur: () => console.log('Blurred'),

    // Contracts for cross-plugin discovery
    contracts: {
        provides: ['text-editor'],
        accepts: ['file-selection'],
        emits: ['file-saved']
    }
});
```

### Multiple Panels

```jsx
// File explorer
api.register('files', {
    type: 'panel',
    component: FileExplorer,
    label: 'Files',
    icon: IconFolder,
    order: 1
});

// Search
api.register('search', {
    type: 'panel',
    component: SearchPanel,
    label: 'Search',
    icon: IconSearch,
    order: 2
});

// Properties
api.register('properties', {
    type: 'panel',
    component: PropertiesPanel,
    label: 'Properties',
    icon: IconSettings,
    order: 3
});
```

## Toolbar Components

Toolbar items are buttons or custom components in the toolbar.

### Toolbar Button

```jsx
api.register('save-btn', {
    type: 'toolbar',
    icon: IconSave,
    label: 'Save',
    tooltip: 'Save file (Ctrl+S)',
    onClick: () => saveFile()
});
```

### Toolbar Options

```jsx
api.register('run-btn', {
    type: 'toolbar',
    icon: IconPlayerPlay,
    label: 'Run',
    tooltip: 'Run project',
    group: 'execution',        // Group buttons together
    order: 1,                  // Order within group
    onClick: () => runProject(),
    disabled: () => !hasProject(),  // Dynamic disable state
    active: () => isRunning(),      // Dynamic active state
    separator: true            // Add separator after this button
});
```

### Custom Toolbar Component

```jsx
function ZoomSlider() {
    const [zoom, setZoom] = createSignal(100);
    return (
        <input
            type="range"
            min="50"
            max="200"
            value={zoom()}
            onInput={(e) => setZoom(e.target.value)}
        />
    );
}

api.register('zoom-control', {
    type: 'toolbar',
    component: ZoomSlider,
    group: 'view'
});
```

## Menu Components

Menu items for the top menu bar.

### Simple Menu

```jsx
api.register('file-menu', {
    type: 'menu',
    label: 'File',
    order: 1,
    submenu: [
        { id: 'new', label: 'New', shortcut: 'Ctrl+N', action: () => newFile() },
        { id: 'open', label: 'Open', shortcut: 'Ctrl+O', action: () => openFile() },
        { divider: true },
        { id: 'save', label: 'Save', shortcut: 'Ctrl+S', action: () => saveFile() },
        { id: 'exit', label: 'Exit', action: () => closeApp() }
    ]
});
```

### Nested Submenu

```jsx
api.register('edit-menu', {
    type: 'menu',
    label: 'Edit',
    order: 2,
    submenu: [
        { id: 'undo', label: 'Undo', shortcut: 'Ctrl+Z', action: () => undo() },
        { id: 'redo', label: 'Redo', shortcut: 'Ctrl+Y', action: () => redo() },
        { divider: true },
        {
            id: 'clipboard',
            label: 'Clipboard',
            submenu: [
                { id: 'cut', label: 'Cut', shortcut: 'Ctrl+X', action: () => cut() },
                { id: 'copy', label: 'Copy', shortcut: 'Ctrl+C', action: () => copy() },
                { id: 'paste', label: 'Paste', shortcut: 'Ctrl+V', action: () => paste() }
            ]
        }
    ]
});
```

### Menu Item with Icon

```jsx
api.register('view-menu', {
    type: 'menu',
    label: 'View',
    order: 3,
    submenu: [
        { id: 'explorer', label: 'Explorer', icon: IconFolder, action: () => toggleExplorer() },
        { id: 'terminal', label: 'Terminal', icon: IconTerminal, action: () => toggleTerminal() }
    ]
});
```

## Status Components

Status bar items displayed at the bottom of the window.

### Simple Status

```jsx
api.register('status-ready', {
    type: 'status',
    component: () => <span class="text-success">Ready</span>,
    align: 'left'
});
```

### Dynamic Status

```jsx
function LineInfo() {
    const [line, setLine] = createSignal(1);
    const [col, setCol] = createSignal(1);

    // Subscribe to editor cursor changes
    onMount(() => {
        editor.on('cursor', (pos) => {
            setLine(pos.line);
            setCol(pos.col);
        });
    });

    return <span>Ln {line()}, Col {col()}</span>;
}

api.register('line-info', {
    type: 'status',
    component: LineInfo,
    align: 'right',
    priority: 100  // Higher = further right
});
```

### Status Options

```jsx
api.register('git-branch', {
    type: 'status',
    component: GitBranchIndicator,
    align: 'left',      // 'left' or 'right'
    priority: 50        // Sort order within alignment
});
```

## Slot Control

Control component visibility with `api.slot()`:

```jsx
// Show a component
api.slot('files').show();

// Hide a component
api.slot('files').hide();

// Toggle visibility
api.slot('files').toggle();

// Focus a component
api.slot('files').focus();
```

### Using Slot Control

```jsx
export default plugin({
    id: 'my-plugin',
    name: 'My Plugin',
    version: '1.0.0',

    start(api) {
        api.register('explorer', {
            type: 'panel',
            component: Explorer,
            label: 'Explorer'
        });

        api.register('toggle-explorer', {
            type: 'toolbar',
            icon: IconFolder,
            tooltip: 'Toggle Explorer',
            onClick: () => api.slot('explorer').toggle()
        });
    }
});
```

## Unregistering Components

Remove components when no longer needed:

```jsx
// Unregister by ID
api.unregister('temp-panel');

// Example: Close file tab
function closeFile(filename) {
    api.unregister(`file-${filename}`);
}
```

## Dynamic Components

Add and remove components at runtime:

```jsx
const [openFiles, setOpenFiles] = createSignal([]);

function openFile(filename) {
    // Add to state
    setOpenFiles([...openFiles(), filename]);

    // Register a new panel
    api.register(`file-${filename}`, {
        type: 'panel',
        component: () => <FileEditor filename={filename} />,
        label: filename,
        closable: true,
        onUnmount: () => {
            // Remove from state when closed
            setOpenFiles(openFiles().filter(f => f !== filename));
        }
    });

    // Focus the new panel
    api.slot(`file-${filename}`).focus();
}
```

## Complete Example

```jsx
import { plugin } from '@/api/plugin';
import { IconCode, IconFolder, IconTerminal, IconSettings, IconSave } from '@tabler/icons-solidjs';

function EditorView() {
    return <div class="p-4">Editor content here</div>;
}

function FileExplorer() {
    return <div class="p-2">File tree here</div>;
}

function ConsolePanel() {
    return <div class="p-2 font-mono">Console output here</div>;
}

export default plugin({
    id: 'code-editor',
    name: 'Code Editor',
    version: '1.0.0',

    start(api) {
        // Panels
        api.register('editor', {
            type: 'panel',
            component: EditorView,
            label: 'Editor',
            icon: IconCode
        });

        api.register('files', {
            type: 'panel',
            component: FileExplorer,
            label: 'Files',
            icon: IconFolder
        });

        api.register('console', {
            type: 'panel',
            component: ConsolePanel,
            label: 'Console',
            icon: IconTerminal
        });

        // Toolbar
        api.register('save-btn', {
            type: 'toolbar',
            icon: IconSave,
            tooltip: 'Save (Ctrl+S)',
            onClick: () => saveFile()
        });

        // Menu
        api.register('file-menu', {
            type: 'menu',
            label: 'File',
            submenu: [
                { id: 'save', label: 'Save', shortcut: 'Ctrl+S', action: () => saveFile() }
            ]
        });

        // Status
        api.register('status-ready', {
            type: 'status',
            component: () => <span>Ready</span>,
            align: 'left'
        });

        // Keyboard shortcuts
        api.shortcut({
            'ctrl+s': () => saveFile(),
            'ctrl+b': () => api.slot('files').toggle()
        });
    }
});
```

## Next Steps

- [Component Registry](/api/registry) - Deep dive into contracts and discovery
- [Layout Manager](/api/layout-manager) - Custom layouts
- [Plugin Lifecycle](/plugins/plugin-lifecycle) - Lifecycle hooks
