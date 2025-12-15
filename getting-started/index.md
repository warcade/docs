# Introduction

WebArcade is a lightweight plugin platform for building native desktop applications. It combines **SolidJS** for the frontend UI and **Rust** for optional high-performance backends.

## What is WebArcade?

WebArcade lets you build desktop applications that:

- **Run natively** on Windows, macOS, and Linux
- **Use web technologies** (HTML, CSS, JavaScript) for the UI
- **Support plugins** that can be added or removed at runtime
- **Stay lightweight** at around 2.5 MB (uses the system's built-in browser engine)

Think of it like building a web app, but it runs as a standalone desktop program.

## How Does It Work?

```
┌─────────────────────────────────────────────────────────┐
│                    Your Application                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   ┌─────────────┐    ┌─────────────┐    ┌────────────┐  │
│   │  Plugin A   │    │  Plugin B   │    │  Plugin C  │  │
│   │  (Editor)   │    │  (Preview)  │    │  (Settings)│  │
│   └─────────────┘    └─────────────┘    └────────────┘  │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                   WebArcade Runtime                      │
│   • Window management                                    │
│   • Plugin loading                                       │
│   • Inter-plugin communication                           │
└─────────────────────────────────────────────────────────┘
```

1. **You write plugins** - Each plugin is a self-contained piece of functionality
2. **WebArcade loads them** - The runtime discovers and loads your plugins
3. **Users see a unified app** - All plugins work together in a single window

## Key Features Explained

### 1. Lightweight Binary (~2.5 MB)

Unlike Electron apps that bundle an entire Chromium browser (~150 MB), WebArcade uses the **system WebView**:

| Platform | WebView Used |
|----------|--------------|
| Windows | Microsoft Edge WebView2 (pre-installed on Windows 10/11) |
| macOS | WebKit (built into macOS) |
| Linux | WebKitGTK (install via package manager) |

This means your app is tiny and uses the browser engine the user already has.

### 2. Dynamic Plugin Loading

Plugins can be loaded at runtime from the `plugins/` folder:

```
my-app/
├── my-app.exe
└── plugins/
    ├── editor.js        ← Plugin A
    ├── preview.js       ← Plugin B
    └── settings.js      ← Plugin C
```

Users can add new plugins by dropping files into this folder. No recompilation needed.

### 3. Optional Rust Backend

Each plugin can optionally have a Rust backend for:

- **File system access** - Read/write files on the user's computer
- **System operations** - Run processes, access hardware
- **Performance** - Heavy computation, data processing
- **Native APIs** - Anything that JavaScript can't do

```
plugins/
└── my-plugin/
    ├── index.jsx      ← Frontend (SolidJS)
    └── my-plugin.dll  ← Backend (Rust, optional)
```

### 4. Component-Based UI

WebArcade provides a component registry system:

```
┌─────────────────────────────────────────────────────────┐
│  Menu Bar       ← api.register({ type: 'menu' })        │
├─────────────────────────────────────────────────────────┤
│  Toolbar        ← api.register({ type: 'toolbar' })     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┬───────────────────────┬──────────┐        │
│  │  Left    │       Viewport        │  Right   │        │
│  │  Panel   │                       │  Panel   │        │
│  │          │   api.register({      │          │        │
│  │          │     type: 'panel',    │          │        │
│  │          │     component: View   │          │        │
│  │          │   })                  │          │        │
│  ├──────────┴───────────────────────┴──────────┤        │
│  │       Bottom Panel                          │        │
│  └─────────────────────────────────────────────┘        │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Status Bar     ← api.register({ type: 'status' })      │
└─────────────────────────────────────────────────────────┘
```

You don't have to build this layout yourself - just register your components with `api.register()`.

### 5. Cross-Plugin Communication

Plugins can talk to each other through:

| Method | Use Case | Example |
|--------|----------|---------|
| **Services** | Share functionality | Audio plugin provides `play()`, `stop()` methods |
| **Messages** | Send events | Notify all plugins when a file is saved |
| **Shared Store** | Share state | All plugins can read/write user preferences |

## Who Is WebArcade For?

WebArcade is for building **any type of desktop application**. If you can build it with web technologies, you can build it with WebArcade.

Some examples:

- **IDE/Editor applications** - Code editors, text editors, markdown editors
- **Creative tools** - Image editors, audio workstations, design tools
- **Productivity apps** - Note-taking, project management, dashboards
- **Media applications** - Music players, video editors, podcast apps
- **Developer tools** - API clients, database managers, Git clients
- **Business software** - CRM systems, inventory management, POS systems
- **Games and entertainment** - Card games, puzzle games, interactive apps
- **Utilities** - File managers, system monitors, backup tools

The plugin architecture makes WebArcade especially powerful for apps where users want to extend functionality with their own plugins - but it works just as well for standalone applications with a fixed set of features.

## Comparison with Other Frameworks

| Feature | WebArcade | Electron | Tauri |
|---------|-----------|----------|-------|
| Binary size | ~2.5 MB | ~150 MB | ~3-5 MB |
| Memory usage | Low | High | Low |
| Runtime plugins | ✅ Yes | ❌ No | ❌ No |
| Frontend | SolidJS | Any | Any |
| Backend | Rust DLLs | Node.js | Rust |
| Learning curve | Medium | Low | Medium |

## Next Steps

Ready to get started?

1. **[Installation](/getting-started/installation)** - Install Rust, Bun, and the WebArcade CLI
2. **[Quick Start](/getting-started/quick-start)** - Create your first app in 5 minutes
