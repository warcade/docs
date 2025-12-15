# Quick Start

Create your first WebArcade application in 5 minutes.

## Step 1: Create a New Project

Open your terminal and run:

```bash
webarcade init my-app
```

This creates a new folder called `my-app` with everything you need.

Now enter the project:

```bash
cd my-app
```

## Step 2: Explore the Project Structure

Your new project looks like this:

```
my-app/
├── src/                    # Frontend source code
│   ├── api/               # Plugin APIs (don't modify)
│   ├── panels/            # Panel components (don't modify)
│   └── ...
├── app/                    # Desktop runtime
│   ├── src/               # Rust source (don't modify)
│   └── Cargo.toml         # App configuration
├── plugins/               # Your plugins go here
│   └── hello-world/       # Example plugin
├── package.json           # Frontend dependencies
└── README.md
```

**Important folders:**

| Folder | What it's for | Do you edit it? |
|--------|---------------|-----------------|
| `plugins/` | Your plugin code | ✅ Yes |
| `app/Cargo.toml` | App name, icon, metadata | ✅ Yes |
| `src/` | Core frontend code | ❌ No |
| `app/src/` | Core runtime code | ❌ No |

## Step 3: Run the App

Start the development server:

```bash
webarcade dev
```

This command:
1. Builds the frontend (takes a few seconds)
2. Compiles the Rust runtime (takes longer on first run)
3. Opens your application window

You should see a window with the default WebArcade interface.

::: tip First Run is Slow
The first time you run `webarcade dev`, Rust compiles many dependencies. This can take 2-5 minutes. Subsequent runs are much faster (a few seconds).
:::

## Step 4: Create Your First Plugin

Let's create a simple plugin. In your terminal (you can open a new one while the app is running):

```bash
webarcade new my-plugin --frontend-only
```

This creates `plugins/my-plugin/index.jsx`:

```jsx
import { plugin } from '@/api/plugin';

export default plugin({
    id: 'my-plugin',
    name: 'My Plugin',
    version: '1.0.0',

    start(api) {
        // This runs when the plugin loads
    }
});
```

## Step 5: Add a Tab and Content

Edit `plugins/my-plugin/index.jsx`:

```jsx
import { plugin } from '@/api/plugin';

// A simple component that displays "Hello World"
function HelloWorld() {
    return (
        <div class="flex items-center justify-center h-full">
            <div class="text-center">
                <h1 class="text-4xl font-bold mb-4">Hello, World!</h1>
                <p class="text-lg opacity-70">
                    This is my first WebArcade plugin.
                </p>
            </div>
        </div>
    );
}

export default plugin({
    id: 'my-plugin',
    name: 'My Plugin',
    version: '1.0.0',

    start(api) {
        // Add a tab to the plugin tab bar
        api.add({
            panel: 'tab',
            label: 'My Plugin',
        });

        // Add content to the main viewport
        api.add({
            panel: 'viewport',
            id: 'main',
            component: HelloWorld,
        });
    }
});
```

## Step 6: Build and See Your Plugin

Build your new plugin:

```bash
webarcade build my-plugin
```

Now restart the app (press `Ctrl+C` in the terminal running `webarcade dev`, then run it again):

```bash
webarcade dev
```

Click on the "My Plugin" tab - you should see your "Hello, World!" message!

## Step 7: Add Interactivity

Let's add a button that counts clicks. Update your plugin:

```jsx
import { plugin } from '@/api/plugin';
import { createSignal } from 'solid-js';

function Counter() {
    // createSignal creates reactive state
    // count() reads the value
    // setCount() updates the value
    const [count, setCount] = createSignal(0);

    return (
        <div class="flex items-center justify-center h-full">
            <div class="text-center">
                <h1 class="text-4xl font-bold mb-4">
                    Count: {count()}
                </h1>
                <button
                    class="btn btn-primary btn-lg"
                    onClick={() => setCount(count() + 1)}
                >
                    Click Me!
                </button>
            </div>
        </div>
    );
}

export default plugin({
    id: 'my-plugin',
    name: 'My Plugin',
    version: '1.0.0',

    start(api) {
        api.add({
            panel: 'tab',
            label: 'My Plugin',
        });

        api.add({
            panel: 'viewport',
            id: 'main',
            component: Counter,
        });
    }
});
```

Rebuild and restart:

```bash
webarcade build my-plugin
webarcade dev
```

Now you have an interactive counter!

## Step 8: Add a Sidebar

Let's add a sidebar panel:

```jsx
import { plugin } from '@/api/plugin';
import { createSignal } from 'solid-js';

const [count, setCount] = createSignal(0);

function MainContent() {
    return (
        <div class="flex items-center justify-center h-full">
            <div class="text-center">
                <h1 class="text-4xl font-bold mb-4">
                    Count: {count()}
                </h1>
                <button
                    class="btn btn-primary btn-lg"
                    onClick={() => setCount(count() + 1)}
                >
                    Click Me!
                </button>
            </div>
        </div>
    );
}

function Sidebar() {
    return (
        <div class="p-4">
            <h2 class="font-bold text-lg mb-4">Controls</h2>
            <div class="space-y-2">
                <button
                    class="btn btn-sm btn-block"
                    onClick={() => setCount(0)}
                >
                    Reset to 0
                </button>
                <button
                    class="btn btn-sm btn-block"
                    onClick={() => setCount(count() + 10)}
                >
                    Add 10
                </button>
                <button
                    class="btn btn-sm btn-block"
                    onClick={() => setCount(count() + 100)}
                >
                    Add 100
                </button>
            </div>
        </div>
    );
}

export default plugin({
    id: 'my-plugin',
    name: 'My Plugin',
    version: '1.0.0',

    start(api) {
        api.add({
            panel: 'tab',
            label: 'My Plugin',
        });

        api.add({
            panel: 'viewport',
            id: 'main',
            component: MainContent,
        });

        // Add a left sidebar
        api.add({
            panel: 'left',
            id: 'controls',
            label: 'Controls',
            component: Sidebar,
        });
    },

    // Show the sidebar when this plugin becomes active
    active(api) {
        api.showLeft(true);
    }
});
```

Rebuild and restart to see your sidebar!

## Understanding What Happened

Let's break down what each part does:

### 1. Plugin Definition

```jsx
export default plugin({
    id: 'my-plugin',      // Unique identifier
    name: 'My Plugin',    // Display name
    version: '1.0.0',     // Version number
    // ... lifecycle hooks
});
```

### 2. Lifecycle Hooks

```jsx
start(api) {
    // Runs ONCE when plugin loads
    // Register all your UI components here
}

active(api) {
    // Runs each time user switches TO this plugin
    // Show/hide panels, refresh data
}
```

### 3. Registering Panels

```jsx
api.add({
    panel: 'tab',         // Where to add (tab bar)
    label: 'My Plugin',   // Text to display
});

api.add({
    panel: 'viewport',    // Where to add (main area)
    id: 'main',          // Unique ID for this panel
    component: Counter,   // SolidJS component to render
});
```

### 4. SolidJS Reactivity

```jsx
const [count, setCount] = createSignal(0);

// Read: count()
// Write: setCount(newValue)
```

SolidJS automatically updates the UI when state changes.

## What's Next?

You've created a working plugin! Here are your next steps:

| Want to... | Read this |
|------------|-----------|
| Register components | [Component Registry](/api/registry) |
| Add toolbar buttons | [Component Registry](/api/registry#toolbar-components) |
| Add a Rust backend | [Full-Stack Plugin](/examples/full-stack) |
| Understand the full API | [Plugin API Reference](/api/plugin-api) |
| See more examples | [Examples](/examples/) |

## Common Commands Reference

| Command | What it does |
|---------|--------------|
| `webarcade init <name>` | Create new project |
| `webarcade new <plugin>` | Create new plugin |
| `webarcade new <plugin> --frontend-only` | Create plugin without Rust |
| `webarcade build <plugin>` | Build a plugin |
| `webarcade build --all` | Build all plugins |
| `webarcade dev` | Build and run app |
| `webarcade app` | Build production app |
