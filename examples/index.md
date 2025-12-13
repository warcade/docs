# Examples

Learn by example with these WebArcade plugin implementations.

## Available Examples

### [Hello World](/examples/hello-world)
A minimal plugin that demonstrates the basic structure and API usage.

**Features covered:**
- Plugin registration
- Tab and viewport panels
- Basic SolidJS component

### [Full-Stack Plugin](/examples/full-stack)
A complete plugin with both frontend UI and Rust backend.

**Features covered:**
- Rust HTTP handlers
- Frontend-backend communication
- State management
- Toolbar and menus

## Quick Reference

### Minimal Plugin

```jsx
import { plugin } from '@/api/plugin';

export default plugin({
    id: 'minimal',
    name: 'Minimal',
    version: '1.0.0',

    start(api) {
        api.add({ panel: 'tab', label: 'Minimal' });
        api.add({
            panel: 'viewport',
            id: 'main',
            component: () => <div class="p-4">Hello!</div>,
        });
    }
});
```

### Plugin with Sidebar

```jsx
import { plugin } from '@/api/plugin';

export default plugin({
    id: 'with-sidebar',
    name: 'With Sidebar',
    version: '1.0.0',

    start(api) {
        api.add({ panel: 'tab', label: 'With Sidebar' });
        api.add({ panel: 'viewport', id: 'main', component: MainView });
        api.add({ panel: 'left', id: 'nav', label: 'Navigation', component: Sidebar });
    },

    active(api) {
        api.showLeft(true);
    }
});
```

### Plugin with State

```jsx
import { plugin } from '@/api/plugin';
import { createSignal } from 'solid-js';

const [count, setCount] = createSignal(0);

function Counter() {
    return (
        <div class="p-4">
            <h1 class="text-2xl">Count: {count()}</h1>
            <button class="btn btn-primary mt-4" onClick={() => setCount(c => c + 1)}>
                Increment
            </button>
        </div>
    );
}

export default plugin({
    id: 'counter',
    name: 'Counter',
    version: '1.0.0',

    start(api) {
        api.add({ panel: 'tab', label: 'Counter' });
        api.add({ panel: 'viewport', id: 'main', component: Counter });
    }
});
```

### Plugin with Shared Store

```jsx
import { plugin } from '@/api/plugin';

function Settings() {
    const theme = api.selector('settings.theme', 'light');

    return (
        <div class="p-4">
            <h1>Current theme: {theme()}</h1>
            <button onClick={() => api.set('settings.theme', 'dark')}>
                Dark Mode
            </button>
        </div>
    );
}

export default plugin({
    id: 'settings',
    name: 'Settings',
    version: '1.0.0',

    start(api) {
        api.set('settings.theme', 'light');
        api.add({ panel: 'tab', label: 'Settings' });
        api.add({ panel: 'viewport', id: 'main', component: Settings });
    }
});
```
