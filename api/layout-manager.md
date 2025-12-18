# Layout Manager

The Layout Manager provides a dynamic system for switching between different UI layouts at runtime. Layouts define the overall structure of your application UI.

## Overview

Layouts are SolidJS components that define how the UI is structured. You can register multiple layouts and switch between them dynamically.

```jsx
import { layout } from 'webarcade';

// Register layouts
layout.register('editor', {
    name: 'Editor',
    component: EditorLayout,
    icon: IconCode
});

layout.register('preview', {
    name: 'Preview',
    component: PreviewLayout,
    icon: IconEye
});

// Switch layouts
layout.setActive('preview');
```

## Registering Layouts

### layout.register(id, config)

Register a new layout.

```jsx
layout.register('material-editor', {
    name: 'Material Editor',
    component: MaterialEditorLayout,
    description: 'Edit materials and shaders',
    icon: IconPalette,
    order: 2,
    slots: {
        sidebar: 'material-properties',
        viewport: 'material-preview'
    }
});
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Unique layout ID |
| `config.component` | `Component` | SolidJS component that renders the layout |
| `config.name` | `string` | Display name |
| `config.description` | `string` | Optional description |
| `config.icon` | `Component` | Optional icon component |
| `config.order` | `number` | Sort order (default: 0) |
| `config.slots` | `object` | Default slot assignments |

### layout.unregister(id)

Remove a registered layout.

```jsx
layout.unregister('material-editor');
```

## Switching Layouts

### layout.setActive(id)

Switch to a different layout.

```jsx
layout.setActive('material-editor');
```

Returns `true` if successful, `false` if layout not found.

### layout.back()

Go back to the previous layout. The Layout Manager maintains a history stack.

```jsx
if (layout.canGoBack()) {
    layout.back();
}
```

### layout.canGoBack()

Check if there's a previous layout to go back to.

```jsx
const hasHistory = layout.canGoBack();
```

## Querying Layouts

### layout.getActiveId()

Get the current active layout ID.

```jsx
const currentId = layout.getActiveId();
```

### layout.getActive()

Get the full configuration of the active layout.

```jsx
const layout = layout.getActive();
console.log(layout.name);  // "Material Editor"
```

### layout.get(id)

Get a layout by ID.

```jsx
const layout = layout.get('material-editor');
```

### layout.getAll()

Get all registered layouts, sorted by order.

```jsx
const layouts = layout.getAll();
layouts.forEach(layout => {
    console.log(layout.name);
});
```

## Slot Assignments

Slots allow layouts to specify which components should be displayed where. You can update slot assignments at runtime.

### layout.setSlots(layoutId, slots)

Update slot assignments for a layout.

```jsx
layout.setSlots('editor', {
    sidebar: 'file-explorer',
    bottomPanel: 'terminal'
});
```

### layout.getSlots(layoutId)

Get slot assignments for a layout.

```jsx
const slots = layout.getSlots('editor');
```

## Reactive Signals

For use in SolidJS components, the Layout Manager provides reactive signals.

```jsx
import { layout } from 'webarcade';

function LayoutSwitcher() {
    const activeId = layout.signals.activeId;
    const layouts = layout.signals.layouts;

    return (
        <div class="flex gap-2">
            <For each={Object.values(layouts())}>
                {(layout) => (
                    <button
                        class={activeId() === layout.id ? 'active' : ''}
                        onClick={() => layout.setActive(layout.id)}
                    >
                        {layout.name}
                    </button>
                )}
            </For>
        </div>
    );
}
```

### Available Signals

| Signal | Description |
|--------|-------------|
| `signals.activeId` | Current active layout ID (getter function) |
| `signals.layouts` | All registered layouts (getter function) |
| `signals.history` | Layout navigation history (getter function) |

## Using from Plugin API

The Layout Manager is accessible from the plugin API:

```jsx
export default plugin({
    id: 'my-plugin',
    name: 'My Plugin',
    version: '1.0.0',

    start(api) {
        // Register a layout
        api.layout.register('custom-layout', {
            name: 'Custom Layout',
            component: CustomLayout
        });

        // Register components
        api.register('main-view', {
            type: 'panel',
            component: MainView,
            label: 'Main'
        });
    },

    active(api) {
        // Switch to custom layout when plugin becomes active
        api.layout.setActive('custom-layout');
    },

    stop(api) {
        // Go back to previous layout when plugin stops
        if (api.layout.canGoBack()) {
            api.layout.back();
        }
    }
});
```

### Plugin API Layout Methods

| Method | Description |
|--------|-------------|
| `api.layout.register(id, config)` | Register a new layout |
| `api.layout.setActive(id)` | Switch to a layout |
| `api.layout.getActiveId()` | Get current layout ID |
| `api.layout.getAll()` | Get all layouts |
| `api.layout.back()` | Go back to previous layout |
| `api.layout.canGoBack()` | Check if back navigation is possible |
| `api.layout.focus()` | Focus the current layout |
| `api.layout.reveal(componentId)` | Reveal a component in the layout |
| `api.layout.fullscreen(enabled)` | Enter/exit fullscreen |
| `api.layout.hideAll()` | Hide all panels |
| `api.layout.showAll()` | Show all panels |

## LayoutRenderer Component

To render the active layout in your app, use the LayoutRenderer component:

```jsx
import { Engine, LayoutRenderer } from 'webarcade';

function App() {
    return (
        <Engine>
            <LayoutRenderer />
        </Engine>
    );
}
```

The LayoutRenderer automatically:
- Renders the currently active layout
- Shows a fallback when no layout is registered
- Handles layout switching reactively

## Layout Change Events

Listen for layout changes:

```jsx
document.addEventListener('layout:change', (event) => {
    const { from, to } = event.detail;
    console.log(`Layout changed from ${from} to ${to}`);
});
```

## Example: Custom Layout Component

```jsx
import { Row, Column, Slot } from 'webarcade';

function EditorLayout() {
    return (
        <Row class="h-screen">
            {/* Left sidebar */}
            <Column class="w-64 border-r">
                <Slot id="sidebar" />
            </Column>

            {/* Main content area */}
            <Column class="flex-1">
                {/* Top toolbar */}
                <Slot id="toolbar" class="h-12 border-b" />

                {/* Viewport */}
                <Slot id="viewport" class="flex-1" />

                {/* Bottom panel */}
                <Slot id="bottom-panel" class="h-48 border-t" />
            </Column>

            {/* Right panel */}
            <Column class="w-64 border-l">
                <Slot id="properties" />
            </Column>
        </Row>
    );
}
```

## Best Practices

1. **Use descriptive IDs** - Layout IDs should clearly indicate their purpose
2. **Provide icons** - Icons help users identify layouts in switchers
3. **Set order** - Use order to control the display sequence
4. **Handle back navigation** - Check `canGoBack()` before calling `back()`
5. **Clean up** - Unregister layouts when your plugin stops if they're plugin-specific
