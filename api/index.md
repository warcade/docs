# API Reference

## Imports

The `webarcade` package provides multiple import paths:

### Main Entry

```jsx
// Everything from one import
import {
    plugin,                    // Plugin creator
    Row, Column, Slot,         // Layout primitives
    Resizable,                 // Resizable containers
    layout,                    // Layout manager
    api,                       // HTTP API
    useReactiveService,        // Hooks
    useEvent, useStore
} from 'webarcade';
```

### Subpath Imports

For more specific imports, use subpaths:

```jsx
// Layout primitives
import { Row, Column, Slot, Resizable } from 'webarcade/layout';

// UI components
import { Modal, Card, Input, DragRegion, WindowControls } from 'webarcade/ui';

// Hooks only
import {
    useReactiveService,
    useEvent,
    useStore,
    useDebounce
} from 'webarcade/hooks';

// Plugin API
import { plugin, bridge, api } from 'webarcade/plugin';

// Bridge API
import { bridge, api, ws } from 'webarcade/bridge';
```

### Import Reference

| Path | What's Available |
|------|------------------|
| `webarcade` | Everything (plugin, layout, hooks, api) |
| `webarcade/layout` | Row, Column, Slot, Resizable, layout manager |
| `webarcade/ui` | Modal, Card, Input, Toast, DragRegion, WindowControls, etc. |
| `webarcade/hooks` | useReactiveService, useEvent, useStore, useDebounce, etc. |
| `webarcade/plugin` | plugin, bridge, api, componentRegistry |
| `webarcade/bridge` | bridge, api, ws |

::: tip
Import from the main `webarcade` entry for convenience, or use subpaths for smaller bundle sizes and clearer imports.
:::

---

## Frontend APIs

### [Plugin Hooks](/api/hooks)
Reactive hooks for components. **Recommended** for accessing services, events, and shared state.

### [Bridge API](/api/bridge-api)
Direct API for plugin lifecycle hooks (`start()`, `stop()`) and non-component code.

### [Plugin API](/api/plugin-api)
Register UI components (panels, toolbar, menus, status bar).

### [Component Registry](/api/registry)
Contract-based component discovery system.

### [Layout Manager](/api/layout-manager)
Switch between different UI layouts.

### [HTTP API](/api/http-api)
Make HTTP requests to Rust backends.

### [Window API](/api/window-api)
Control the application window (fullscreen, close, etc).

## Backend APIs

### [Rust API](/api/rust-api)
Build plugin backends with Rust. Define HTTP routes and handlers.

---

## Quick Start

**In components**, use hooks:

```jsx
import { useReactiveService, useStore, useEvent } from 'webarcade';

function MyComponent() {
    const engine = useReactiveService('my-service');
    const [value, setValue] = useStore('my.value', 0);
    useEvent('my:event', (data) => console.log(data));

    return <div>{value()}</div>;
}
```

**In lifecycle hooks**, use direct API:

```jsx
export default plugin({
    id: 'my-plugin',
    start(api) {
        api.provide('my-service', myService);
        api.register('my-panel', { type: 'panel', component: MyPanel });
    },
    stop(api) {
        api.unprovide('my-service');
    }
});
```
