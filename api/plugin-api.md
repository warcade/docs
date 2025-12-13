# Plugin API

The Plugin API is used to register UI components and control the application layout.

## Creating a Plugin

```jsx
import { plugin } from '@/api/plugin';

export default plugin({
    id: 'my-plugin',
    name: 'My Plugin',
    version: '1.0.0',

    start(api) { /* ... */ },
    active(api) { /* ... */ },
    inactive(api) { /* ... */ },
    stop(api) { /* ... */ }
});
```

## api.add()

Register components to panels.

```jsx
api.add(options: AddOptions): void
```

### Options

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `panel` | `'tab' \| 'viewport' \| 'left' \| 'right' \| 'bottom'` | Yes | Target panel |
| `id` | `string` | For panels | Unique identifier |
| `component` | `Component` | For panels | SolidJS component |
| `label` | `string` | No | Tab/button label |
| `icon` | `Component` | No | Icon component |
| `visible` | `boolean` | No | Initial visibility (default: `true`) |
| `order` | `number` | No | Sort order (default: `0`) |
| `closable` | `boolean` | No | Can user close tab (default: `true`) |
| `shared` | `boolean` | No | Share with other plugins (default: `false`) |
| `start` | `(api) => void` | No | Called when panel created |
| `active` | `(api) => void` | No | Called when plugin active |
| `inactive` | `(api) => void` | No | Called when plugin inactive |

### Examples

```jsx
// Plugin tab
api.add({
    panel: 'tab',
    label: 'My Plugin',
    icon: IconHome,
});

// Viewport
api.add({
    panel: 'viewport',
    id: 'editor',
    label: 'Editor',
    component: EditorView,
    closable: true,
});

// Left sidebar
api.add({
    panel: 'left',
    id: 'explorer',
    label: 'Explorer',
    icon: IconFolder,
    component: FileExplorer,
});
```

## api.remove()

Remove a registered component.

```jsx
api.remove(id: string): void
```

```jsx
api.remove('file-viewer');
```

## Panel Visibility

### Show/Hide Methods

```jsx
api.showLeft(visible: boolean): void
api.showRight(visible: boolean): void
api.showBottom(visible: boolean): void

api.hideLeft(): void
api.hideRight(): void
api.hideBottom(): void

api.toggleLeft(): void
api.toggleRight(): void
api.toggleBottom(): void
```

### Focus Methods

```jsx
api.focusViewport(id: string): void
api.focusLeft(id: string): void
api.focusRight(id: string): void
api.focusBottom(id: string): void
```

## Toolbar

### api.toolbarGroup()

Create a toolbar button group.

```jsx
api.toolbarGroup(id: string, options: GroupOptions): void
```

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Group label |
| `order` | `number` | Sort order |

```jsx
api.toolbarGroup('file-group', { label: 'File', order: 1 });
```

### api.toolbar()

Add a toolbar button.

```jsx
api.toolbar(id: string, options: ToolbarOptions): void
```

| Property | Type | Description |
|----------|------|-------------|
| `icon` | `Component` | Button icon |
| `tooltip` | `string` | Hover tooltip |
| `group` | `string` | Group ID |
| `order` | `number` | Sort order within group |
| `onClick` | `() => void` | Click handler |
| `active` | `() => boolean` | Active state (reactive) |
| `disabled` | `() => boolean` | Disabled state (reactive) |
| `separator` | `boolean` | Add separator after |
| `component` | `Component` | Custom component instead of icon |

```jsx
api.toolbar('save', {
    icon: IconSave,
    tooltip: 'Save (Ctrl+S)',
    group: 'file-group',
    order: 1,
    onClick: () => saveFile(),
    active: () => hasChanges(),
    disabled: () => isReadOnly(),
});
```

## Menu

### api.menu()

Add a top menu.

```jsx
api.menu(id: string, options: MenuOptions): void
```

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Menu label |
| `order` | `number` | Sort order |
| `submenu` | `MenuItem[]` | Menu items |

### MenuItem

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique ID |
| `label` | `string` | Display label |
| `icon` | `Component` | Optional icon |
| `shortcut` | `string` | Keyboard shortcut display |
| `action` | `() => void` | Click handler |
| `submenu` | `MenuItem[]` | Nested submenu |
| `divider` | `boolean` | Visual separator |

```jsx
api.menu('file', {
    label: 'File',
    order: 1,
    submenu: [
        { id: 'new', label: 'New', shortcut: 'Ctrl+N', action: () => newFile() },
        { id: 'open', label: 'Open', shortcut: 'Ctrl+O', action: () => openFile() },
        { divider: true },
        {
            id: 'export',
            label: 'Export',
            submenu: [
                { id: 'pdf', label: 'As PDF', action: () => exportPDF() },
                { id: 'png', label: 'As PNG', action: () => exportPNG() },
            ]
        },
    ]
});
```

## Footer

### api.footer()

Add a footer component.

```jsx
api.footer(id: string, options: FooterOptions): void
```

| Property | Type | Description |
|----------|------|-------------|
| `component` | `Component` | Footer component |
| `order` | `number` | Sort order |

```jsx
api.footer('status', {
    component: () => <span class="text-success">Ready</span>,
    order: 1,
});
```

## UI Visibility

```jsx
api.showToolbar(visible: boolean): void
api.showMenu(visible: boolean): void
api.showFooter(visible: boolean): void
api.showTabs(visible: boolean): void          // Viewport tabs
api.showPluginTabs(visible: boolean): void    // Plugin tab bar

api.fullscreen(enabled: boolean): void
api.toggleFullscreen(): void
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

---

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
| `context` | `string` | No | Where to show: `'viewport'`, `'global'` (default: `'global'`) |
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

::: tip
Context menu items are automatically cleaned up when your plugin is disabled.
:::

---

## Shared Components

### api.addShared()

Add a component shared by another plugin.

```jsx
api.addShared(sharedId: string, options: SharedOptions): void
```

```jsx
api.addShared('file-manager:explorer', {
    panel: 'left',
    label: 'Files',
    order: 1,
});
```

### api.useShared()

Get a shared component's configuration.

```jsx
api.useShared(sharedId: string): PanelConfig | null
```

```jsx
const explorer = api.useShared('file-manager:explorer');
if (explorer) {
    const FileExplorer = explorer.component;
}
```
