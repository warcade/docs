# Technical Internals

This page covers how WebArcade works under the hood. Understanding these internals can help you build more efficient plugins and debug complex issues.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         WebArcade App                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    WebView (UI Layer)                    │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │    │
│  │  │Plugin A │ │Plugin B │ │Plugin C │ │Plugin D │        │    │
│  │  │  (JS)   │ │  (JS)   │ │  (JS)   │ │  (JS)   │        │    │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘        │    │
│  │       │           │           │           │              │    │
│  │       └───────────┴─────┬─────┴───────────┘              │    │
│  │                         │                                │    │
│  │                   Bridge API                             │    │
│  │                    (HTTP/WS)                             │    │
│  └─────────────────────────┬───────────────────────────────┘    │
│                            │                                     │
│  ┌─────────────────────────┴───────────────────────────────┐    │
│  │                  Rust Runtime (Core)                     │    │
│  │                                                          │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐               │    │
│  │  │  Window  │  │  Bridge  │  │  Plugin  │               │    │
│  │  │ Manager  │  │  Server  │  │  Loader  │               │    │
│  │  │(tao/wry) │  │  (HTTP)  │  │  (DLLs)  │               │    │
│  │  └──────────┘  └──────────┘  └────┬─────┘               │    │
│  │                                   │                      │    │
│  │       ┌─────────┐ ┌─────────┐ ┌───┴─────┐               │    │
│  │       │Plugin A │ │Plugin B │ │Plugin C │               │    │
│  │       │ (.dll)  │ │ (.dll)  │ │ (.dll)  │               │    │
│  │       └─────────┘ └─────────┘ └─────────┘               │    │
│  └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## The Plugin Builder

The builder is the heart of WebArcade's developer experience. It transforms your plugin source code into optimized bundles.

### Frontend Build Pipeline

```
Source Files          Transformations              Output
─────────────────────────────────────────────────────────────

index.jsx      ──┐
viewport.jsx   ──┼──▶  Parse & Analyze  ──▶  Resolve Imports
sidebar.jsx    ──┘           │
                             ▼
                      Fetch Dependencies ◀── npm registry
                             │
                             ▼
                      Transform JSX ──▶ SolidJS compiled output
                             │
                             ▼
                      Tree-shake ──▶ Remove unused code
                             │
                             ▼
                      Bundle ──▶ Single optimized .js file
                             │
                             ▼
                      Minify ──▶ Compress for production
                             │
                             ▼
                      plugin.js (output)
```

### Automatic Dependency Resolution

When the builder encounters an import:

```jsx
import { format } from 'date-fns';
```

It performs these steps:

1. **Detection** - Identifies `date-fns` as an external package
2. **Resolution** - Fetches package metadata from npm registry
3. **Download** - Downloads the package and its dependencies
4. **Analysis** - Builds a dependency graph
5. **Tree-shaking** - Includes only `format` and its dependencies
6. **Bundling** - Inlines the code into your plugin bundle

This happens transparently - you just write imports and the builder handles the rest.

### Rust Build Pipeline

```
Source Files          Transformations              Output
─────────────────────────────────────────────────────────────

Cargo.toml     ──┐
mod.rs         ──┼──▶  Parse Routes  ──▶  Generate router code
router.rs      ──┘           │
                             ▼
                      Inject Dependencies ──▶ webarcade-api, serde
                             │
                             ▼
                      Cargo Build ──▶ Compile to cdylib
                             │
                             ▼
                      Link ──▶ Resolve native dependencies
                             │
                             ▼
                      plugin.dll / plugin.so / plugin.dylib
```

### Route Code Generation

Routes defined in `Cargo.toml`:

```toml
[routes]
"GET /users" = "handle_get_users"
"POST /users" = "handle_create_user"
```

Are transformed into generated router code:

```rust
// Auto-generated by builder
pub fn route(req: HttpRequest) -> HttpResponse {
    match (req.method.as_str(), req.path.as_str()) {
        ("GET", "/users") => handle_get_users(req),
        ("POST", "/users") => handle_create_user(req),
        _ => HttpResponse::not_found(),
    }
}
```

## FFI (Foreign Function Interface)

WebArcade uses FFI to enable communication between JavaScript and Rust.

### How JS Calls Rust

```
┌──────────────────┐     HTTP Request      ┌──────────────────┐
│                  │ ───────────────────▶  │                  │
│    JavaScript    │   localhost:3001      │   Rust Runtime   │
│    (WebView)     │                       │                  │
│                  │ ◀───────────────────  │                  │
└──────────────────┘     HTTP Response     └──────────────────┘
```

1. **Frontend makes HTTP request** to `localhost:3001`
2. **Bridge server receives request** and routes to appropriate plugin DLL
3. **DLL function is called** via FFI
4. **Response is serialized** and sent back to frontend

### DLL Interface

Each plugin DLL exports a standard C interface:

```rust
// Exported function signature
#[no_mangle]
pub extern "C" fn handle_request(
    req_ptr: *const u8,
    req_len: usize,
    res_ptr: *mut u8,
    res_len: *mut usize,
) -> i32
```

The runtime:
1. Serializes the HTTP request to JSON bytes
2. Calls the DLL function with pointers
3. DLL writes response to the output buffer
4. Runtime deserializes and sends HTTP response

### Memory Safety

WebArcade handles memory across the FFI boundary carefully:

- **Request data** is owned by the runtime, borrowed by DLL
- **Response data** is allocated by DLL, freed by runtime
- **Panic handling** catches Rust panics to prevent crashes

```rust
// Internal panic handler
std::panic::catch_unwind(|| {
    plugin.handle_request(req)
}).unwrap_or_else(|_| {
    HttpResponse::internal_error("Plugin panicked")
})
```

## Plugin Loading

### Dynamic Loading Process

```
App Startup
    │
    ▼
Scan plugins/ directory
    │
    ▼
For each plugin:
    ├──▶ Load .js file ──▶ Execute in WebView
    │
    └──▶ Load .dll file ──▶ dlopen() / LoadLibrary()
              │
              ▼
         Verify exports
              │
              ▼
         Register routes
              │
              ▼
         Plugin ready
```

### Hot Reloading (Dev Mode)

In development, the builder watches for changes:

```
File Changed
    │
    ▼
Detect change type
    │
    ├──▶ .jsx/.js ──▶ Rebuild JS ──▶ Refresh WebView
    │
    └──▶ .rs ──▶ Rebuild DLL ──▶ Unload old ──▶ Load new
```

::: warning
DLL hot reload requires unloading the old DLL first. On Windows, this may require restarting if the file is locked.
:::

## IPC (Inter-Process Communication)

### Bridge Server

The bridge server runs on `localhost:3001` and handles all frontend-to-backend communication:

```
┌─────────────────────────────────────────────────────────────┐
│                      Bridge Server                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  /plugins/:id/*  ──▶  Route to plugin DLL                   │
│                                                              │
│  /api/window     ──▶  Window controls (minimize, close)     │
│                                                              │
│  /api/fs         ──▶  File system operations                │
│                                                              │
│  /api/shell      ──▶  Shell commands                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### WebSocket Server

Real-time communication uses WebSocket on `localhost:3002`:

```
┌──────────────┐                      ┌──────────────┐
│   Plugin A   │ ◀───── pub/sub ────▶ │   Plugin B   │
└──────────────┘                      └──────────────┘
        │                                     │
        └──────────────┬──────────────────────┘
                       │
                       ▼
              ┌──────────────────┐
              │  WebSocket Hub   │
              │   (Rust Core)    │
              └──────────────────┘
```

Messages are broadcast to subscribed plugins:

```js
// Plugin A publishes
bridge.publish('file:saved', { path: '/foo/bar.txt' });

// Plugin B receives (if subscribed)
bridge.subscribe('file:saved', (data) => {
    console.log('File saved:', data.path);
});
```

## WebView Integration

### Window Management (tao)

WebArcade uses [tao](https://github.com/tauri-apps/tao) for cross-platform window management:

- **Borderless window** with custom title bar
- **System tray** integration
- **Multi-window** support
- **Native menus** and dialogs

### WebView Rendering (wry)

[wry](https://github.com/tauri-apps/wry) provides the WebView:

| Platform | Engine |
|----------|--------|
| Windows | WebView2 (Chromium-based Edge) |
| macOS | WebKit |
| Linux | WebKitGTK |

### JavaScript ↔ Rust Bindings

Beyond HTTP, some operations use direct IPC:

```rust
// Rust side - register handler
webview.register_handler("window:minimize", |_| {
    window.set_minimized(true);
    Ok(())
});
```

```js
// JS side - invoke handler
window.__WEBARCADE__.invoke('window:minimize');
```

## Performance Optimizations

### Lazy Loading

Plugins are loaded on-demand:

```js
// Plugin tab clicked
api.add({
    panel: 'tab',
    label: 'Heavy Plugin',
    onActivate: async () => {
        // Component loaded only when tab is clicked
        const { HeavyComponent } = await import('./heavy.jsx');
        return HeavyComponent;
    }
});
```

### Shared Dependencies

Common dependencies are deduplicated across plugins:

```
Plugin A imports: solid-js, lodash
Plugin B imports: solid-js, date-fns
Plugin C imports: solid-js, lodash

Result:
├── solid-js (shared, loaded once)
├── lodash (shared between A and C)
└── date-fns (only for B)
```

### Connection Pooling

The bridge server maintains connection pools for efficiency:

- **HTTP keep-alive** for repeated requests
- **WebSocket** persistent connections
- **DLL handles** cached after first load

## Security Model

### Plugin Isolation

Each plugin runs in a sandboxed context:

- **JavaScript** runs in WebView with standard web security
- **Rust DLLs** have full system access (by design)
- **Cross-plugin calls** go through the bridge (auditable)

### Plugin Isolation

Plugins run with their own lifecycle and UI registrations. Cross-plugin communication happens through the bridge API.

### Content Security Policy

The WebView enforces a strict CSP:

```
default-src 'self';
script-src 'self' 'unsafe-inline';
connect-src 'self' http://localhost:3001 ws://localhost:3002;
```

## Debugging

### Runtime Logs

Enable verbose logging:

```bash
RUST_LOG=debug webarcade dev
RUST_LOG=webarcade=trace webarcade dev  # Even more detail
```

### DLL Debugging

Attach a debugger to the running process:

```bash
# Windows (Visual Studio)
devenv /debugexe webarcade.exe

# Linux/macOS (lldb)
lldb webarcade
```

### WebView DevTools

Open DevTools in development mode:
- Press `F12` or `Ctrl+Shift+I`
- Or enable in config: `devtools: true`

### Performance Profiling

```bash
# CPU profiling
WEBARCADE_PROFILE=cpu webarcade dev

# Memory profiling
WEBARCADE_PROFILE=memory webarcade dev
```

## Build Artifacts

### Production Build Output

```
build/
├── webarcade.exe          # Main executable
├── webarcade.dll          # Core runtime library
├── resources/
│   ├── index.html         # Shell HTML
│   └── core.js            # Core frontend bundle
└── plugins/
    ├── my-plugin.js       # Plugin frontend
    └── my-plugin.dll      # Plugin backend (if full-stack)
```

### Distribution

For distribution, bundle everything into a single installer or archive:

```bash
webarcade package --target windows --format msi
webarcade package --target macos --format dmg
webarcade package --target linux --format appimage
```
