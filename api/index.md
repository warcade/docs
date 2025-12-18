# API Reference

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
import { useReactiveService, useStore, useEvent } from '@/api/plugin';

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
