# Layouts

The layout system is how you structure your WebArcade application. It provides a flexible, composable way to arrange panels, toolbars, menus, and status bars.

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Menu Bar                                                   │
├─────────────────────────────────────────────────────────────┤
│  Toolbar                                                    │
├──────────┬─────────────────────────────┬────────────────────┤
│          │                             │                    │
│  Left    │       Main Viewport         │      Right         │
│  Panel   │                             │      Panel         │
│          │     (Tabs from plugins)     │                    │
│          │                             │                    │
│          ├─────────────────────────────┤                    │
│          │     Bottom Panel            │                    │
├──────────┴─────────────────────────────┴────────────────────┤
│  Status Bar                                                 │
└─────────────────────────────────────────────────────────────┘
```

## Core Concepts

### Slots

A **Slot** is a container that holds content from plugins. When a plugin registers a panel, it gets rendered inside a Slot. Multiple panels in the same Slot become tabs.

```jsx
// Plugin A registers a panel
api.register('file-explorer', {
    type: 'panel',
    slot: 'left',
    component: FileExplorer,
    label: 'Files'
});

// Plugin B registers another panel in the same slot
api.register('git-panel', {
    type: 'panel',
    slot: 'left',
    component: GitPanel,
    label: 'Git'
});

// Result: Left panel has two tabs - "Files" and "Git"
```

### Layout Primitives

WebArcade provides layout primitives for building custom layouts:

| Component | Purpose |
|-----------|---------|
| `Row` | Horizontal flex container |
| `Column` | Vertical flex container |
| `Slot` | Renders registered components as tabs |
| `Resizable` | Container with drag handles for resizing |

### Predefined Slots

The default layout includes these slots:

| Slot Name | Location | Default |
|-----------|----------|---------|
| `left` | Left sidebar | Collapsible, resizable |
| `right` | Right sidebar | Collapsible, resizable |
| `viewport` | Main content area | Primary workspace |
| `bottom` | Bottom panel | Collapsible, resizable |
| `toolbar` | Top toolbar | Always visible |
| `menu` | Menu bar | Always visible |
| `status` | Status bar | Always visible |

## Quick Start

### Register a Panel

```jsx
import { plugin } from '@/api/plugin';

function MyPanel() {
    return (
        <div class="p-4">
            <h1>My Panel Content</h1>
        </div>
    );
}

export default plugin({
    id: 'my-plugin',
    name: 'My Plugin',
    version: '1.0.0',

    start(api) {
        api.register('my-panel', {
            type: 'panel',
            slot: 'viewport',  // Where to render
            component: MyPanel,
            label: 'My Panel',
            icon: IconCode
        });
    }
});
```

### Register Toolbar Items

```jsx
api.register('save-button', {
    type: 'toolbar',
    component: () => (
        <button class="btn btn-sm btn-ghost" onClick={handleSave}>
            <IconDeviceFloppy size={18} />
        </button>
    ),
    position: 'left'  // 'left', 'center', or 'right'
});
```

### Register Status Bar Items

```jsx
api.register('line-count', {
    type: 'status',
    component: () => <span>Lines: {lineCount()}</span>,
    position: 'right'
});
```

## Layout Sections

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

### [Primitives](./primitives)
Learn about Row, Column, Slot, and Resizable components.

### [Custom Layouts](./custom-layouts)
Create your own layouts with the Layout Manager.

### [Resizable Panels](./resizable)
Add drag-to-resize functionality to panels.

### [Responsive Design](./responsive)
Adapt layouts to different window sizes.

</div>
