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
import { plugin } from '@/api/plugin';
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
        // Register plugin tab
        api.add({
            panel: 'tab',
            label: 'Hello World',
            icon: IconHome,
        });

        // Register main viewport
        api.add({
            panel: 'viewport',
            id: 'main',
            label: 'Home',
            component: HelloView,
        });

        // Register sidebar
        api.add({
            panel: 'left',
            id: 'nav',
            label: 'Navigation',
            component: Sidebar,
        });
    },

    active(api) {
        // Show sidebar when plugin is active
        api.showLeft(true);
    },

    inactive(api) {
        // Optionally hide sidebar when switching away
        // api.hideLeft();
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

### Tab Registration
```jsx
api.add({
    panel: 'tab',
    label: 'Hello World',
    icon: IconHome,
});
```

### Viewport Panel
```jsx
api.add({
    panel: 'viewport',
    id: 'main',
    label: 'Home',
    component: HelloView,
});
```

### Sidebar Panel
```jsx
api.add({
    panel: 'left',
    id: 'nav',
    label: 'Navigation',
    component: Sidebar,
});
```

### Lifecycle Hooks
```jsx
active(api) {
    api.showLeft(true);  // Show sidebar when active
}
```

### SolidJS Reactivity
```jsx
const [darkMode, setDarkMode] = createSignal(false);
// Use: darkMode(), setDarkMode(!darkMode())
```

## Next Steps

- Add toolbar buttons with `api.toolbar()`
- Add menu items with `api.menu()`
- Try the [Full-Stack Plugin](/examples/full-stack) example
