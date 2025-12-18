# Examples

Learn by example with these WebArcade plugin implementations.

## Available Examples

### [Hello World](/examples/hello-world)
A minimal plugin that demonstrates the basic structure and API usage.

**Features covered:**
- Plugin registration
- Component registration with `api.register()`
- Keyboard shortcuts

### [Full-Stack Plugin](/examples/full-stack)
A complete plugin with both frontend UI and Rust backend.

**Features covered:**
- Rust HTTP handlers
- Frontend-backend communication
- Component registry
- Toolbar and menus

## Quick Reference

### Minimal Plugin

```jsx
import { plugin } from 'webarcade';

export default plugin({
    id: 'minimal',
    name: 'Minimal',
    version: '1.0.0',

    start(api) {
        api.register('main-view', {
            type: 'panel',
            component: () => <div class="p-4">Hello!</div>,
            label: 'Main'
        });
    }
});
```

### Plugin with Sidebar

```jsx
import { plugin } from 'webarcade';

function MainView() {
    return <div class="p-4">Main Content</div>;
}

function Sidebar() {
    return (
        <div class="p-4">
            <h3 class="font-bold mb-2">Navigation</h3>
            <ul class="menu">
                <li><a>Home</a></li>
                <li><a>About</a></li>
            </ul>
        </div>
    );
}

export default plugin({
    id: 'with-sidebar',
    name: 'With Sidebar',
    version: '1.0.0',

    start(api) {
        api.register('main', {
            type: 'panel',
            component: MainView,
            label: 'Main'
        });

        api.register('sidebar', {
            type: 'panel',
            component: Sidebar,
            label: 'Navigation',
            icon: IconList
        });
    }
});
```

### Plugin with State

```jsx
import { plugin } from 'webarcade';
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
        api.register('counter', {
            type: 'panel',
            component: Counter,
            label: 'Counter'
        });
    }
});
```

### Plugin with Toolbar

```jsx
import { plugin } from 'webarcade';
import { createSignal } from 'solid-js';
import { IconPlus, IconMinus, IconRefresh } from '@tabler/icons-solidjs';

const [count, setCount] = createSignal(0);

function CounterDisplay() {
    return (
        <div class="p-4 text-center">
            <h1 class="text-6xl font-bold">{count()}</h1>
        </div>
    );
}

export default plugin({
    id: 'toolbar-demo',
    name: 'Toolbar Demo',
    version: '1.0.0',

    start(api) {
        api.register('display', {
            type: 'panel',
            component: CounterDisplay,
            label: 'Counter'
        });

        api.register('increment', {
            type: 'toolbar',
            icon: IconPlus,
            tooltip: 'Increment',
            onClick: () => setCount(c => c + 1)
        });

        api.register('decrement', {
            type: 'toolbar',
            icon: IconMinus,
            tooltip: 'Decrement',
            onClick: () => setCount(c => c - 1)
        });

        api.register('reset', {
            type: 'toolbar',
            icon: IconRefresh,
            tooltip: 'Reset',
            onClick: () => setCount(0),
            disabled: () => count() === 0
        });
    }
});
```

### Plugin with Shared Store

```jsx
import { plugin } from 'webarcade';

function Settings(props) {
    const { api } = props;
    const theme = api.selector('settings.theme', 'light');

    return (
        <div class="p-4">
            <h1>Current theme: {theme()}</h1>
            <div class="flex gap-2 mt-4">
                <button
                    class="btn"
                    onClick={() => api.set('settings.theme', 'light')}
                >
                    Light
                </button>
                <button
                    class="btn"
                    onClick={() => api.set('settings.theme', 'dark')}
                >
                    Dark
                </button>
            </div>
        </div>
    );
}

export default plugin({
    id: 'settings',
    name: 'Settings',
    version: '1.0.0',

    start(api) {
        // Initialize default theme
        if (!api.has('settings.theme')) {
            api.set('settings.theme', 'light');
        }

        api.register('settings-panel', {
            type: 'panel',
            component: () => <Settings api={api} />,
            label: 'Settings'
        });

        // Watch theme changes
        api.watch('settings.theme', (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
        });
    }
});
```

### Plugin with Services

```jsx
import { plugin } from 'webarcade';

// Provider plugin
export const audioPlugin = plugin({
    id: 'audio',
    name: 'Audio',
    version: '1.0.0',

    start(api) {
        const audioService = {
            play: (sound) => console.log('Playing:', sound),
            stop: () => console.log('Stopped'),
            setVolume: (v) => console.log('Volume:', v)
        };

        api.provide('audio', audioService);
    }
});

// Consumer plugin
export const gamePlugin = plugin({
    id: 'game',
    name: 'Game',
    version: '1.0.0',

    async start(api) {
        // Wait for audio service
        const audio = await api.use('audio');

        api.register('game-view', {
            type: 'panel',
            component: () => (
                <div class="p-4">
                    <button class="btn" onClick={() => audio.play('click')}>
                        Play Sound
                    </button>
                </div>
            ),
            label: 'Game'
        });
    }
});
```

### Plugin with Keyboard Shortcuts

```jsx
import { plugin } from 'webarcade';
import { createSignal } from 'solid-js';

const [logs, setLogs] = createSignal([]);

function addLog(msg) {
    setLogs(l => [...l.slice(-9), msg]);
}

function ShortcutDemo() {
    return (
        <div class="p-4">
            <h2 class="font-bold mb-2">Press shortcuts:</h2>
            <ul class="text-sm opacity-70 mb-4">
                <li>Ctrl+S - Save</li>
                <li>Ctrl+N - New</li>
                <li>Ctrl+Shift+P - Command Palette</li>
            </ul>
            <div class="bg-base-200 p-2 rounded">
                <For each={logs()}>
                    {(log) => <div class="text-sm">{log}</div>}
                </For>
            </div>
        </div>
    );
}

export default plugin({
    id: 'shortcuts-demo',
    name: 'Shortcuts Demo',
    version: '1.0.0',

    start(api) {
        api.register('demo', {
            type: 'panel',
            component: ShortcutDemo,
            label: 'Shortcuts'
        });

        api.shortcut({
            'ctrl+s': () => addLog('Save triggered'),
            'ctrl+n': () => addLog('New triggered'),
            'ctrl+shift+p': () => addLog('Command palette triggered')
        });
    }
});
```

### Plugin with Contracts

```jsx
import { plugin } from 'webarcade';

// File browser plugin with contracts
export default plugin({
    id: 'file-browser',
    name: 'File Browser',
    version: '1.0.0',

    start(api) {
        api.register('tree', {
            type: 'panel',
            component: FileTree,
            label: 'Files',
            contracts: {
                provides: ['file-browser', 'tree-view'],
                emits: ['file-selected', 'file-opened']
            }
        });

        // Emit events when files are selected
        function selectFile(path) {
            api.publish('file-selected', { path });
        }

        function openFile(path) {
            api.publish('file-opened', { path });
        }
    }
});

// Editor plugin that consumes the contract
export const editorPlugin = plugin({
    id: 'editor',
    name: 'Editor',
    version: '1.0.0',

    start(api) {
        api.register('code-editor', {
            type: 'panel',
            component: CodeEditor,
            label: 'Editor',
            contracts: {
                accepts: ['file-selection']
            }
        });

        // Subscribe to file selection
        api.subscribe('file-selected', ({ path }) => {
            console.log('File selected:', path);
        });

        // Find all file browsers
        const browsers = api.findByContract({ provides: 'file-browser' });
        console.log('Found browsers:', browsers.length);
    }
});
```
