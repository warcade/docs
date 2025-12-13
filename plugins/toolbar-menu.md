# Toolbar & Menus

Add toolbar buttons and menu items to your plugins.

## Toolbar

### Toolbar Groups

Organize toolbar buttons into groups:

```jsx
start(api) {
    // Create groups (order determines position)
    api.toolbarGroup('file-group', { label: 'File', order: 1 });
    api.toolbarGroup('edit-group', { label: 'Edit', order: 2 });
    api.toolbarGroup('view-group', { label: 'View', order: 3 });
}
```

### Toolbar Buttons

```jsx
api.toolbar('save', {
    icon: IconDeviceFloppy,
    tooltip: 'Save file (Ctrl+S)',
    group: 'file-group',
    order: 1,
    onClick: () => saveFile(),
});

api.toolbar('undo', {
    icon: IconArrowBack,
    tooltip: 'Undo',
    group: 'edit-group',
    order: 1,
    onClick: () => undo(),
});

api.toolbar('redo', {
    icon: IconArrowForward,
    tooltip: 'Redo',
    group: 'edit-group',
    order: 2,
    onClick: () => redo(),
});
```

### Dynamic States

```jsx
api.toolbar('save', {
    icon: IconDeviceFloppy,
    tooltip: 'Save file',
    group: 'file-group',
    onClick: () => saveFile(),

    // Reactive states
    active: () => hasUnsavedChanges(),    // Highlighted when true
    disabled: () => isReadOnly(),          // Disabled when true
});
```

### Separators

Add visual separators between buttons:

```jsx
api.toolbar('save', {
    icon: IconDeviceFloppy,
    tooltip: 'Save',
    group: 'file-group',
    order: 1,
    separator: true,    // Adds separator AFTER this button
    onClick: () => saveFile(),
});
```

### Custom Components

Use custom components instead of icons:

```jsx
api.toolbar('zoom-slider', {
    component: () => (
        <input
            type="range"
            min="50"
            max="200"
            value={zoom()}
            onInput={(e) => setZoom(e.target.value)}
            class="w-24"
        />
    ),
    group: 'view-group',
    tooltip: 'Zoom level',
});
```

## Top Menu

### Basic Menu

```jsx
api.menu('file', {
    label: 'File',
    order: 1,
    submenu: [
        {
            id: 'new',
            label: 'New',
            icon: IconFile,
            shortcut: 'Ctrl+N',
            action: () => newFile()
        },
        {
            id: 'open',
            label: 'Open',
            icon: IconFolder,
            shortcut: 'Ctrl+O',
            action: () => openFile()
        },
        { divider: true },  // Visual separator
        {
            id: 'save',
            label: 'Save',
            shortcut: 'Ctrl+S',
            action: () => saveFile()
        },
        {
            id: 'save-as',
            label: 'Save As...',
            shortcut: 'Ctrl+Shift+S',
            action: () => saveFileAs()
        },
    ]
});
```

### Nested Submenus

```jsx
api.menu('file', {
    label: 'File',
    order: 1,
    submenu: [
        { id: 'new', label: 'New', action: () => newFile() },
        { divider: true },
        {
            id: 'export',
            label: 'Export',
            submenu: [
                { id: 'pdf', label: 'As PDF', action: () => exportPDF() },
                { id: 'png', label: 'As PNG', action: () => exportPNG() },
                { id: 'svg', label: 'As SVG', action: () => exportSVG() },
            ]
        },
        {
            id: 'import',
            label: 'Import',
            submenu: [
                { id: 'json', label: 'From JSON', action: () => importJSON() },
                { id: 'csv', label: 'From CSV', action: () => importCSV() },
            ]
        },
    ]
});
```

### Multiple Menus

```jsx
start(api) {
    // File menu
    api.menu('file', {
        label: 'File',
        order: 1,
        submenu: [
            { id: 'new', label: 'New', shortcut: 'Ctrl+N', action: () => {} },
            { id: 'open', label: 'Open', shortcut: 'Ctrl+O', action: () => {} },
            { divider: true },
            { id: 'exit', label: 'Exit', action: () => window.close() },
        ]
    });

    // Edit menu
    api.menu('edit', {
        label: 'Edit',
        order: 2,
        submenu: [
            { id: 'undo', label: 'Undo', shortcut: 'Ctrl+Z', action: () => {} },
            { id: 'redo', label: 'Redo', shortcut: 'Ctrl+Y', action: () => {} },
            { divider: true },
            { id: 'cut', label: 'Cut', shortcut: 'Ctrl+X', action: () => {} },
            { id: 'copy', label: 'Copy', shortcut: 'Ctrl+C', action: () => {} },
            { id: 'paste', label: 'Paste', shortcut: 'Ctrl+V', action: () => {} },
        ]
    });

    // View menu
    api.menu('view', {
        label: 'View',
        order: 3,
        submenu: [
            { id: 'zoom-in', label: 'Zoom In', shortcut: 'Ctrl++', action: () => {} },
            { id: 'zoom-out', label: 'Zoom Out', shortcut: 'Ctrl+-', action: () => {} },
            { id: 'reset-zoom', label: 'Reset Zoom', shortcut: 'Ctrl+0', action: () => {} },
            { divider: true },
            { id: 'fullscreen', label: 'Fullscreen', shortcut: 'F11', action: () => api.toggleFullscreen() },
        ]
    });
}
```

## Footer

Add status indicators and custom components to the footer:

```jsx
api.footer('status', {
    component: () => (
        <div class="flex items-center gap-2 text-sm">
            <span class="text-success">Ready</span>
        </div>
    ),
    order: 1,
});

api.footer('line-col', {
    component: () => (
        <div class="text-sm opacity-70">
            Ln {line()}, Col {col()}
        </div>
    ),
    order: 2,
});

api.footer('encoding', {
    component: () => <span class="text-sm opacity-70">UTF-8</span>,
    order: 3,
});
```

## Visibility Controls

Show or hide UI elements:

```jsx
api.showToolbar(true);       // Show/hide toolbar
api.showMenu(true);          // Show/hide top menu
api.showFooter(true);        // Show/hide footer
api.showTabs(true);          // Show/hide viewport tabs
api.showPluginTabs(true);    // Show/hide plugin tab bar
```
