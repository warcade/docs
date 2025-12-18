# API Reference

This section provides comprehensive documentation for all WebArcade APIs.

## Frontend APIs

### [Plugin Hooks](/api/hooks) :badge[New]{type="tip"}
Reactive hooks for plugin development. The **recommended** way to access services, events, and shared state.

Key hooks:
- `useReactiveService()` - Reactive service access
- `useEvent()` / `usePublish()` - Event pub/sub with auto-cleanup
- `useStore()` - Reactive shared state
- `useDebounce()` / `useThrottle()` - Utility hooks

### [Plugin API](/api/plugin-api)
Core API for building plugins. Register UI components using the unified component registry.

Key methods:
- `api.register()` - Register panels, toolbar items, menus, status bar
- `api.unregister()` - Remove registered components
- `api.slot()` - Control component visibility (show/hide/toggle/focus)
- `api.layout` - Layout management (switch layouts, navigate back)
- `api.shortcut()` - Keyboard shortcuts
- `api.context()` - Context menu registration

### [Component Registry](/api/registry)
Contract-based component system for cross-plugin communication.

Features:
- **Component Types** - Panel, Toolbar, Menu, Status
- **Contracts** - provides, accepts, emits
- **Discovery** - Find components by contract

### [Layout Manager](/api/layout-manager)
Dynamic layout system for switching between different UI arrangements.

Features:
- **Register Layouts** - Define custom layout components
- **Switch Layouts** - Change UI at runtime
- **History** - Navigate back to previous layouts

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

### Plugin Hooks (Recommended)

```jsx
import {
    useReactiveService,
    useEvent,
    usePublish,
    useStore,
    useDebounce
} from '@/api/plugin';

function MyComponent() {
    // Reactive service access
    const engine = useReactiveService('game-engine');

    // Store with reactivity
    const [score, setScore] = useStore('player.score', 0);

    // Events with auto-cleanup
    useEvent('enemy:killed', (data) => {
        setScore(s => s + data.points);
    });

    // Publish events
    const publish = usePublish('game:action');

    // Debounced function
    const save = useDebounce(() => engine.save(), 1000);

    return (
        <div>
            <div>Score: {score()}</div>
            <div>Meshes: {engine.meshes().length}</div>
            <button onClick={() => publish({ type: 'jump' })}>Jump</button>
        </div>
    );
}
```

### Component Registration

```jsx
// Register a panel component
api.register('explorer', {
    type: 'panel',
    component: Explorer,
    label: 'Explorer',
    icon: IconFolder,
    contracts: {
        provides: ['file-browser'],
        accepts: ['file-selection'],
        emits: ['file-opened']
    }
});

// Register a toolbar button
api.register('save-btn', {
    type: 'toolbar',
    icon: IconSave,
    label: 'Save',
    tooltip: 'Save file (Ctrl+S)',
    onClick: () => save(),
    group: 'file-group'
});

// Register a menu
api.register('file-menu', {
    type: 'menu',
    label: 'File',
    submenu: [
        { id: 'new', label: 'New', shortcut: 'Ctrl+N', action: () => {} },
        { id: 'open', label: 'Open', shortcut: 'Ctrl+O', action: () => {} },
        { divider: true },
        { id: 'save', label: 'Save', shortcut: 'Ctrl+S', action: () => {} }
    ]
});

// Register a status bar item
api.register('line-info', {
    type: 'status',
    component: LineInfo,
    align: 'right'
});
```

### Slot Control

```jsx
// Control component visibility
api.slot('explorer').show();
api.slot('explorer').hide();
api.slot('explorer').toggle();
api.slot('explorer').focus();
```

### Layout Management

```jsx
// Switch to a different layout
api.layout.setActive('material-editor');

// Go back to previous layout
api.layout.back();

// Get current layout
const currentLayout = api.layout.getActiveId();

// Check if can go back
if (api.layout.canGoBack()) {
    api.layout.back();
}
```

### Keyboard Shortcuts

```jsx
// Register shortcuts (convenience method)
api.shortcut({
    'ctrl+s': () => save(),
    'ctrl+n': () => newFile(),
    'ctrl+shift+p': () => openCommandPalette()
});

// Or use the full API
const unregister = api.shortcut.register((event) => {
    if (api.shortcut.matches(event, 'ctrl+s')) {
        event.preventDefault();
        save();
    }
});
```

### Context Menus

```jsx
api.context({
    context: 'file-tree',
    label: 'Open',
    icon: IconFile,
    action: (data) => openFile(data.path),
    order: 1
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
import { api } from '@/api/plugin';

// Frontend
const response = await api('my-plugin/endpoint');
const data = await response.json();

// Rust backend
pub async fn handle_request(req: HttpRequest) -> HttpResponse {
    json_response(&json!({ "status": "ok" }))
}
```

### Events

```jsx
// Emit an event
api.emit('file-saved', { path: '/path/to/file' });

// Listen for events
const unsubscribe = api.on('file-saved', (data) => {
    console.log('File saved:', data.path);
});
```
