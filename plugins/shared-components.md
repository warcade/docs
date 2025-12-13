# Shared Components

Plugins can share components with other plugins, enabling reusable functionality across your application.

## Sharing a Component

Mark a component as shared when registering:

```jsx
// Plugin A: file-manager
start(api) {
    api.add({
        panel: 'left',
        id: 'file-explorer',
        label: 'Files',
        component: FileExplorer,
        shared: true,    // Allow other plugins to use this
    });
}
```

## Using Shared Components

Other plugins can add the shared component to their own panels:

```jsx
// Plugin B: editor
start(api) {
    // Add Plugin A's file explorer to our left panel
    api.addShared('file-manager:file-explorer', {
        panel: 'left',           // Can put in different panel
        label: 'Project Files',  // Override label
        order: 1,                // Override order
    });
}
```

## Getting Shared Config

Get a shared component's configuration without adding it:

```jsx
// Get the shared panel config
const sharedPanel = api.useShared('file-manager:file-explorer');

if (sharedPanel) {
    // Access the component
    const FileExplorer = sharedPanel.component;

    // Use in your own component
    return <FileExplorer />;
}
```

## Shared Component ID Format

Shared components are identified by: `plugin-id:component-id`

```jsx
// Plugin "audio-player" shares component with id "mixer"
// Reference it as: "audio-player:mixer"

api.addShared('audio-player:mixer', {
    panel: 'bottom',
    label: 'Audio Mixer',
});
```

## Example: Shared Console

```jsx
// Plugin: debug-tools
// Provides a shared console component

import { plugin } from '@/api/plugin';
import { createSignal } from 'solid-js';

const [logs, setLogs] = createSignal([]);

function ConsolePanel() {
    return (
        <div class="h-full bg-base-300 font-mono text-sm p-2 overflow-auto">
            <For each={logs()}>
                {(log) => (
                    <div class={`text-${log.type === 'error' ? 'error' : 'base-content'}`}>
                        [{log.time}] {log.message}
                    </div>
                )}
            </For>
        </div>
    );
}

export default plugin({
    id: 'debug-tools',
    name: 'Debug Tools',
    version: '1.0.0',

    start(api) {
        // Share the console component
        api.add({
            panel: 'bottom',
            id: 'console',
            label: 'Console',
            component: ConsolePanel,
            shared: true,
        });

        // Provide a logging service
        api.provide('logger', {
            log: (msg) => setLogs(l => [...l, { type: 'log', message: msg, time: new Date().toLocaleTimeString() }]),
            error: (msg) => setLogs(l => [...l, { type: 'error', message: msg, time: new Date().toLocaleTimeString() }]),
            clear: () => setLogs([]),
        });
    }
});
```

```jsx
// Plugin: my-app
// Uses the shared console

export default plugin({
    id: 'my-app',
    name: 'My App',
    version: '1.0.0',

    start(api) {
        // Add the shared console to our bottom panel
        api.addShared('debug-tools:console', {
            panel: 'bottom',
            label: 'App Console',
            order: 1,
        });
    },

    async active(api) {
        // Use the logger service
        const logger = await api.use('logger');
        logger.log('My App is now active');
    }
});
```

## Best Practices

1. **Use descriptive IDs** - Make component IDs clear and specific
2. **Document shared components** - Let other plugin authors know what's available
3. **Keep components self-contained** - Shared components should work without external dependencies
4. **Provide services alongside** - If a shared component needs functionality, provide it as a service

## Finding Available Shared Components

Check the plugin documentation or source code for available shared components. Common patterns:

| Plugin | Shared Component | Purpose |
|--------|-----------------|---------|
| `file-manager` | `file-explorer` | File tree navigation |
| `debug-tools` | `console` | Logging console |
| `themes` | `theme-picker` | Theme selection UI |
| `settings` | `settings-panel` | App settings |
