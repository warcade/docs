# Custom Layouts

WebArcade's Layout Manager lets you register and switch between different layouts at runtime.

## Layout Manager

The Layout Manager is a central registry for layouts:

```jsx
import { LayoutManager } from '@/api/layout';

// Register a layout
LayoutManager.register('compact', CompactLayout);

// Switch to a layout
LayoutManager.set('compact');

// Get current layout
const current = LayoutManager.current();

// Go back to previous layout
LayoutManager.back();
```

---

## Creating a Layout

A layout is a component that defines the overall structure:

```jsx
function CompactLayout() {
    return (
        <Column class="h-screen">
            <Slot name="toolbar" />
            <Slot name="viewport" class="flex-1" />
            <Slot name="status" />
        </Column>
    );
}
```

### Register Your Layout

```jsx
import { LayoutManager } from '@/api/layout';

LayoutManager.register('compact', CompactLayout, {
    name: 'Compact',
    description: 'Minimal layout with just toolbar and viewport',
    icon: IconLayoutBoard
});
```

---

## Layout Examples

### Minimal Layout

Just the viewport, nothing else:

```jsx
function MinimalLayout() {
    return (
        <div class="h-screen w-screen">
            <Slot name="viewport" />
        </div>
    );
}
```

### Split View Layout

Two viewports side by side:

```jsx
function SplitLayout() {
    return (
        <Column class="h-screen">
            <Slot name="toolbar" />
            <Row class="flex-1">
                <Slot name="viewport" class="flex-1" />
                <div class="w-px bg-base-300" />
                <Slot name="viewport-secondary" class="flex-1" />
            </Row>
            <Slot name="status" />
        </Column>
    );
}
```

### Focus Mode Layout

Maximized viewport with overlay panels:

```jsx
function FocusLayout() {
    const [showSidebar, setShowSidebar] = createSignal(false);

    return (
        <div class="h-screen relative">
            {/* Main viewport takes full screen */}
            <Slot name="viewport" class="h-full w-full" />

            {/* Floating sidebar overlay */}
            <Show when={showSidebar()}>
                <div class="absolute left-0 top-0 h-full w-80 bg-base-100 shadow-xl">
                    <Slot name="left" />
                </div>
            </Show>

            {/* Toggle button */}
            <button
                class="absolute left-4 top-4 btn btn-circle btn-ghost"
                onClick={() => setShowSidebar(!showSidebar())}
            >
                <IconMenu2 />
            </button>
        </div>
    );
}
```

### Three Column Layout

Left sidebar, main content, right sidebar:

```jsx
function ThreeColumnLayout() {
    return (
        <Column class="h-screen">
            <Slot name="menu" />
            <Slot name="toolbar" />

            <Row class="flex-1 overflow-hidden">
                <Resizable direction="horizontal" initialSize={200}>
                    <Slot name="left" />
                </Resizable>

                <Slot name="viewport" class="flex-1" />

                <Resizable direction="horizontal" initialSize={300} handlePosition="start">
                    <Slot name="right" />
                </Resizable>
            </Row>

            <Slot name="status" />
        </Column>
    );
}
```

---

## Switching Layouts

### Programmatically

```jsx
// Switch to a specific layout
LayoutManager.set('compact');

// Switch with transition
LayoutManager.set('focus', { transition: 'fade' });

// Go back to previous
LayoutManager.back();
```

### From a Plugin

```jsx
export default plugin({
    id: 'layout-switcher',
    name: 'Layout Switcher',
    version: '1.0.0',

    start(api) {
        // Add toolbar button to switch layouts
        api.register('layout-toggle', {
            type: 'toolbar',
            component: () => (
                <div class="dropdown dropdown-end">
                    <label tabindex="0" class="btn btn-ghost btn-sm">
                        <IconLayout size={18} />
                    </label>
                    <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li><a onClick={() => LayoutManager.set('default')}>Default</a></li>
                        <li><a onClick={() => LayoutManager.set('compact')}>Compact</a></li>
                        <li><a onClick={() => LayoutManager.set('focus')}>Focus</a></li>
                    </ul>
                </div>
            ),
            position: 'right'
        });
    }
});
```

### Keyboard Shortcuts

```jsx
api.shortcuts.register('ctrl+1', () => LayoutManager.set('default'));
api.shortcuts.register('ctrl+2', () => LayoutManager.set('compact'));
api.shortcuts.register('ctrl+3', () => LayoutManager.set('focus'));
```

---

## Layout State

Layouts can maintain their own state:

```jsx
function StatefulLayout() {
    const [leftCollapsed, setLeftCollapsed] = createSignal(false);
    const [bottomCollapsed, setBottomCollapsed] = createSignal(true);

    return (
        <Column class="h-screen">
            <Slot name="toolbar" />

            <Row class="flex-1 overflow-hidden">
                <Show when={!leftCollapsed()}>
                    <Resizable direction="horizontal" initialSize={250}>
                        <Slot name="left" />
                    </Resizable>
                </Show>

                <Column class="flex-1">
                    <Slot name="viewport" class="flex-1" />

                    <Show when={!bottomCollapsed()}>
                        <Resizable direction="vertical" initialSize={200} handlePosition="start">
                            <Slot name="bottom" />
                        </Resizable>
                    </Show>
                </Column>
            </Row>

            <Slot name="status" />
        </Column>
    );
}
```

---

## Layout Events

Listen for layout changes:

```jsx
// In your plugin
api.layout.on('change', (newLayout, oldLayout) => {
    console.log(`Layout changed from ${oldLayout} to ${newLayout}`);
});

api.layout.on('beforeChange', (newLayout, oldLayout) => {
    // Save state before layout changes
    saveCurrentState();
});
```

---

## Best Practices

### 1. Always Include Core Slots

Most layouts should include:
- `viewport` - Main content area
- `toolbar` - Common actions
- `status` - Status information

```jsx
function MyLayout() {
    return (
        <Column class="h-screen">
            <Slot name="toolbar" />
            <Slot name="viewport" class="flex-1" />
            <Slot name="status" />
        </Column>
    );
}
```

### 2. Handle Overflow

Prevent content from overflowing:

```jsx
<Row class="flex-1 overflow-hidden">
    <Slot name="left" class="overflow-auto" />
    <Slot name="viewport" class="flex-1 overflow-auto" />
</Row>
```

### 3. Persist User Preferences

Save and restore panel sizes:

```jsx
const savedSize = localStorage.getItem('left-panel-size') || 250;

<Resizable
    initialSize={parseInt(savedSize)}
    onResizeEnd={(size) => localStorage.setItem('left-panel-size', size)}
>
    <Slot name="left" />
</Resizable>
```

### 4. Provide Fallbacks

Handle slots with no content:

```jsx
<Slot
    name="right"
    fallback={
        <div class="flex items-center justify-center h-full text-base-content/50">
            No panels
        </div>
    }
/>
```
