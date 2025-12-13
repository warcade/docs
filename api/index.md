# API Reference

This section provides comprehensive documentation for all WebArcade APIs.

## Frontend APIs

### [Plugin API](/api/plugin-api)
Core API for building plugins. Register UI components, manage panel visibility, and control the application layout.

Key methods:
- `api.add()` - Register panels, viewport, sidebars
- `api.toolbar()` - Add toolbar buttons
- `api.menu()` - Add menu items
- `api.footer()` - Add footer components

### [Bridge API](/api/bridge-api)
Inter-plugin communication system. Share data and functionality between plugins.

Features:
- **Services** - Share objects between plugins
- **Message Bus** - Pub/sub event communication
- **Shared Store** - Reactive state management

### [HTTP API](/api/http-api)
Communication with Rust backend. Make HTTP requests to plugin routes.

## Backend APIs

### [Rust API](/api/rust-api)
Build plugin backends with Rust. Define HTTP routes and handlers.

Key types:
- `HttpRequest` - Incoming request data
- `HttpResponse` - Response builder
- `Plugin` trait - Plugin metadata

## Quick Reference

### Panel Registration

```jsx
api.add({
    panel: 'viewport' | 'left' | 'right' | 'bottom' | 'tab',
    id: 'component-id',
    component: MyComponent,
    label: 'Tab Label',
    icon: IconComponent,
});
```

### Service Communication

```jsx
// Provider
api.provide('audio', audioService);

// Consumer
const audio = await api.use('audio');
```

### Shared Store

```jsx
// Write
api.set('player.health', 100);

// Read
const health = api.get('player.health');

// Watch
api.watch('player.health', (val) => console.log(val));

// Reactive (SolidJS)
const health = api.selector('player.health');
```

### HTTP Requests

```jsx
// Frontend
const response = await api('my-plugin/endpoint');
const data = await response.json();

// Rust backend
pub async fn handle_request(req: HttpRequest) -> HttpResponse {
    json_response(&json!({ "status": "ok" }))
}
```
