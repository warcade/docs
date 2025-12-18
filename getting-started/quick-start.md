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
├── app/                    # Desktop runtime
│   ├── src/               # Rust source (don't modify)
│   └── Cargo.toml         # App configuration
├── plugins/               # Your plugins go here
│   └── demo/              # Example plugin
├── package.json           # Frontend dependencies
└── README.md
```

**Important folders:**

| Folder | What it's for | Do you edit it? |
|--------|---------------|-----------------|
| `plugins/` | Your plugin code | Yes |
| `app/Cargo.toml` | App name, icon, metadata | Yes |
| `app/src/` | Core runtime code | No |

::: tip Framework is in npm
The WebArcade framework (APIs, components, etc.) comes from the `webarcade` npm package. Just import what you need:
```jsx
import { plugin, Column, Row, Toolbar } from 'webarcade';
import { DragRegion, WindowControls } from 'webarcade/components/ui';
```
:::

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

This creates `plugins/my-plugin/index.jsx`.

## Step 5: Add Content

Edit `plugins/my-plugin/index.jsx` to create a complete plugin with a layout:

```jsx
import { plugin, Column, Toolbar } from 'webarcade';
import { DragRegion, WindowControls } from 'webarcade/components/ui';

// Your main content component
function HelloWorld() {
    return (
        <div class="flex-1 flex items-center justify-center">
            <div class="text-center">
                <h1 class="text-4xl font-bold mb-4">Hello, World!</h1>
                <p class="text-lg opacity-70">
                    This is my first WebArcade plugin.
                </p>
            </div>
        </div>
    );
}

// Layout component - this is what actually renders on screen
function MyLayout() {
    return (
        <Column class="h-screen bg-base-100">
            <Toolbar>
                <DragRegion class="flex-1 h-full" />
                <WindowControls />
            </Toolbar>
            <HelloWorld />
        </Column>
    );
}

export default plugin({
    id: 'my-plugin',
    name: 'My Plugin',
    version: '1.0.0',

    start(api) {
        // Register the layout
        api.layout.register('my-layout', {
            name: 'My Layout',
            component: MyLayout,
            order: 1
        });

        // Activate this layout
        api.layout.setActive('my-layout');
    }
});
```

::: tip Understanding Layouts
Every plugin needs a **layout** to display content. The layout includes:
- `Column` - A flex column container
- `Toolbar` - The top bar with window controls
- `DragRegion` - Makes the toolbar draggable (for moving the window)
- `WindowControls` - Minimize, maximize, close buttons
- Your content below the toolbar
:::

## Step 6: Build and See Your Plugin

Build your new plugin:

```bash
webarcade build my-plugin
```

Now restart the app (press `Ctrl+C` in the terminal running `webarcade dev`, then run it again):

```bash
webarcade dev
```

You should see your "Hello, World!" message!

## Step 7: Add Interactivity

Let's add a button that counts clicks. Update your plugin:

```jsx
import { plugin, Column, Toolbar } from 'webarcade';
import { DragRegion, WindowControls } from 'webarcade/components/ui';
import { createSignal } from 'solid-js';

function Counter() {
    // createSignal creates reactive state
    // count() reads the value
    // setCount() updates the value
    const [count, setCount] = createSignal(0);

    return (
        <div class="flex-1 flex items-center justify-center">
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

function MyLayout() {
    return (
        <Column class="h-screen bg-base-100">
            <Toolbar>
                <DragRegion class="flex-1 h-full" />
                <WindowControls />
            </Toolbar>
            <Counter />
        </Column>
    );
}

export default plugin({
    id: 'my-plugin',
    name: 'My Plugin',
    version: '1.0.0',

    start(api) {
        api.layout.register('my-layout', {
            name: 'My Layout',
            component: MyLayout,
            order: 1
        });
        api.layout.setActive('my-layout');
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

Let's add a sidebar to your layout:

```jsx
import { plugin, Column, Row, Toolbar } from 'webarcade';
import { DragRegion, WindowControls } from 'webarcade/components/ui';
import { createSignal } from 'solid-js';

const [count, setCount] = createSignal(0);

function MainContent() {
    return (
        <div class="flex-1 flex items-center justify-center">
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
        <div class="w-64 bg-base-200 p-4 border-r border-base-300">
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

function MyLayout() {
    return (
        <Column class="h-screen bg-base-100">
            <Toolbar>
                <DragRegion class="flex-1 h-full" />
                <WindowControls />
            </Toolbar>
            <Row class="flex-1">
                <Sidebar />
                <MainContent />
            </Row>
        </Column>
    );
}

export default plugin({
    id: 'my-plugin',
    name: 'My Plugin',
    version: '1.0.0',

    start(api) {
        api.layout.register('my-layout', {
            name: 'My Layout',
            component: MyLayout,
            order: 1
        });
        api.layout.setActive('my-layout');
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
    // Register your layout and set it active
}

stop(api) {
    // Runs when plugin is unloaded
    // Clean up resources
}
```

### 3. Registering a Layout

```jsx
api.layout.register('my-layout', {
    name: 'My Layout',      // Display name
    component: MyLayout,    // SolidJS component to render
    order: 1                // Priority (lower = higher priority)
});

api.layout.setActive('my-layout');  // Make this layout visible
```

### 4. Layout Structure

```jsx
import { Column, Row, Toolbar } from 'webarcade';
import { DragRegion, WindowControls } from 'webarcade/components/ui';

function MyLayout() {
    return (
        <Column class="h-screen">      {/* Vertical flex container */}
            <Toolbar>                   {/* Top bar */}
                <DragRegion />          {/* Draggable area */}
                <WindowControls />      {/* Min/max/close buttons */}
            </Toolbar>
            <Row class="flex-1">        {/* Horizontal flex container */}
                <Sidebar />             {/* Your sidebar */}
                <MainContent />         {/* Your main content */}
            </Row>
        </Column>
    );
}
```

### 5. SolidJS Reactivity

```jsx
const [count, setCount] = createSignal(0);

// Read: count()
// Write: setCount(newValue)
```

SolidJS automatically updates the UI when state changes.

## Step 9: Using Slots (Plugin Interoperability)

What if you want your layout to display components from *other* plugins? That's where `Slot` comes in.

First, register a panel component (this can be in any plugin):

```jsx
// In any plugin's start() function
api.register('my-panel', {
    type: 'panel',
    component: MyPanelComponent,
    label: 'My Panel',
    icon: IconStar
});
```

Then use `Slot` in your layout to pull it in:

```jsx
import { plugin, Column, Row, Toolbar, Slot } from 'webarcade';
import { DragRegion, WindowControls } from 'webarcade/components/ui';

function MyLayout() {
    return (
        <Column class="h-screen bg-base-100">
            <Toolbar>
                <DragRegion class="flex-1 h-full" />
                <WindowControls />
            </Toolbar>
            <Row class="flex-1">
                {/* Pull in registered panels by their full ID (plugin-id:component-id) */}
                <Slot name="sidebar" use={['file-browser:tree', 'git:changes']} size="250px" />
                <Slot name="main" use={['editor:code']} flex={1} />
                <Slot name="properties" use={['inspector:props']} size="300px" />
            </Row>
        </Column>
    );
}
```

**Slot props:**
- `use` - Array of component IDs to display (format: `plugin-id:component-id`)
- `name` - Name for this slot (for styling/debugging)
- `size` - Fixed width/height (e.g., `"250px"`)
- `flex` - Flex grow value (e.g., `1` to fill remaining space)
- `showTabs` - Show tab bar when multiple components (default: auto)

When multiple components are in a slot, they appear as tabs!

## What's Next?

You've created a working plugin! Here are your next steps:

| Want to... | Read this |
|------------|-----------|
| Learn about component types | [Component System](/plugins/panels) |
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
