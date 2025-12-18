# Hello World Plugin

A minimal WebArcade plugin that demonstrates the basic structure.

## Create the Plugin

```bash
webarcade new hello-world --frontend-only
```

## Plugin Structure

```
plugins/hello-world/
└── index.jsx
```

## index.jsx

```jsx
import { plugin } from 'webarcade';
import { createSignal } from 'solid-js';
import { IconHome, IconMoon, IconSun } from '@tabler/icons-solidjs';

// Component state
const [darkMode, setDarkMode] = createSignal(false);

// Main view component
function HelloView() {
    return (
        <div class="flex flex-col items-center justify-center h-full gap-6">
            <div class="text-6xl">👋</div>
            <h1 class="text-4xl font-bold">Hello, WebArcade!</h1>
            <p class="text-lg opacity-70">
                Welcome to your first plugin.
            </p>
            <div class="flex gap-4">
                <button
                    class="btn btn-primary"
                    onClick={() => alert('Button clicked!')}
                >
                    Click Me
                </button>
                <button
                    class="btn btn-outline"
                    onClick={() => setDarkMode(!darkMode())}
                >
                    {darkMode() ? <IconSun size={20} /> : <IconMoon size={20} />}
                    Toggle Theme
                </button>
            </div>
        </div>
    );
}

// Sidebar component
function Sidebar() {
    return (
        <div class="p-4">
            <h2 class="font-bold mb-4">Navigation</h2>
            <ul class="menu">
                <li><a class="active">Home</a></li>
                <li><a>About</a></li>
                <li><a>Settings</a></li>
            </ul>
        </div>
    );
}

// Plugin definition
export default plugin({
    id: 'hello-world',
    name: 'Hello World',
    version: '1.0.0',

    start(api) {
        // Register main viewport panel
        api.register('main-view', {
            type: 'panel',
            component: HelloView,
            label: 'Home',
            icon: IconHome
        });

        // Register sidebar panel
        api.register('sidebar', {
            type: 'panel',
            component: Sidebar,
            label: 'Navigation'
        });

        // Register keyboard shortcuts
        api.shortcut({
            'ctrl+h': () => alert('Hello from shortcut!')
        });
    },

    stop(api) {
        console.log('Hello World plugin stopped');
    }
});
```

## Build and Run

```bash
# Build the plugin
webarcade build hello-world

# Run the application
webarcade dev
```

## What This Example Demonstrates

### Plugin Registration

```jsx
export default plugin({
    id: 'hello-world',
    name: 'Hello World',
    version: '1.0.0',
    // lifecycle hooks...
});
```

### Panel Registration

```jsx
api.register('main-view', {
    type: 'panel',
    component: HelloView,
    label: 'Home',
    icon: IconHome
});
```

### Sidebar Panel

```jsx
api.register('sidebar', {
    type: 'panel',
    component: Sidebar,
    label: 'Navigation'
});
```

### Keyboard Shortcuts

```jsx
api.shortcut({
    'ctrl+h': () => alert('Hello from shortcut!')
});
```

### SolidJS Reactivity

```jsx
const [darkMode, setDarkMode] = createSignal(false);
// Use: darkMode(), setDarkMode(!darkMode())
```

## Adding Toolbar Buttons

Extend the plugin with toolbar buttons:

```jsx
start(api) {
    // ... panel registration

    api.register('refresh-btn', {
        type: 'toolbar',
        icon: IconRefresh,
        tooltip: 'Refresh',
        onClick: () => location.reload()
    });

    api.register('settings-btn', {
        type: 'toolbar',
        icon: IconSettings,
        tooltip: 'Settings',
        onClick: () => openSettings()
    });
}
```

## Adding Menu Items

Add a menu to the plugin:

```jsx
start(api) {
    // ... panel registration

    api.register('file-menu', {
        type: 'menu',
        label: 'File',
        order: 1,
        submenu: [
            { id: 'new', label: 'New', shortcut: 'Ctrl+N', action: () => {} },
            { id: 'open', label: 'Open', shortcut: 'Ctrl+O', action: () => {} },
            { divider: true },
            { id: 'exit', label: 'Exit', action: () => api.exit() }
        ]
    });
}
```

## Adding Status Bar Items

Add status information:

```jsx
start(api) {
    // ... panel registration

    api.register('status-ready', {
        type: 'status',
        component: () => <span class="text-success">Ready</span>,
        align: 'left'
    });

    api.register('status-version', {
        type: 'status',
        component: () => <span class="opacity-50">v1.0.0</span>,
        align: 'right'
    });
}
```

## Next Steps

- Add toolbar buttons with `api.register({ type: 'toolbar' })`
- Add menu items with `api.register({ type: 'menu' })`
- Try the [Full-Stack Plugin](/examples/full-stack) example
- Learn about [Contracts](/api/registry) for cross-plugin communication
