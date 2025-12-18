# Shared Store

The Shared Store lets plugins share reactive state. Any plugin can read, write, and watch values in the store.

## Basic Usage

### Set Values

```jsx
// Set a value
api.bridge.store.set('theme', 'dark');

// Set nested values with dot notation
api.bridge.store.set('settings.editor.fontSize', 14);
api.bridge.store.set('settings.editor.lineNumbers', true);

// Set entire objects
api.bridge.store.set('user', {
    id: 123,
    name: 'John',
    preferences: {
        notifications: true
    }
});
```

### Get Values

```jsx
// Get a value
const theme = api.bridge.store.get('theme');
// 'dark'

// Get nested values
const fontSize = api.bridge.store.get('settings.editor.fontSize');
// 14

// Get with default value
const locale = api.bridge.store.get('settings.locale', 'en-US');
```

### Delete Values

```jsx
// Delete a value
api.bridge.store.delete('theme');

// Delete nested value
api.bridge.store.delete('settings.editor.fontSize');
```

---

## Watching Changes

### Watch Specific Paths

```jsx
// Watch a single value
api.bridge.store.watch('theme', (newValue, oldValue) => {
    console.log(`Theme changed from ${oldValue} to ${newValue}`);
    updateTheme(newValue);
});

// Watch nested paths
api.bridge.store.watch('settings.editor.fontSize', (size) => {
    editor.setFontSize(size);
});
```

### Watch Objects

```jsx
// Watch entire object
api.bridge.store.watch('user', (newUser, oldUser) => {
    if (newUser.id !== oldUser?.id) {
        reloadUserData();
    }
});

// Watch with deep option for nested changes
api.bridge.store.watch('settings', (settings) => {
    saveSettings(settings);
}, { deep: true });
```

### Unwatch

```jsx
const unwatch = api.bridge.store.watch('theme', handler);

// Later, stop watching
unwatch();
```

---

## Store Hooks

Use hooks in components for reactive access:

### useStore

Get reactive access to a store path:

```jsx
import { useStore } from '@/api/plugin/hooks';

function ThemeToggle() {
    const [theme, setTheme] = useStore('theme');

    return (
        <button onClick={() => setTheme(theme() === 'dark' ? 'light' : 'dark')}>
            Current: {theme()}
        </button>
    );
}
```

### useStoreSelector

Select and transform store values:

```jsx
import { useStoreSelector } from '@/api/plugin/hooks';

function UserGreeting() {
    // Select just the name from user object
    const userName = useStoreSelector('user', (user) => user?.name ?? 'Guest');

    return <span>Hello, {userName()}</span>;
}
```

### useStoreValue (Read-Only)

When you only need to read:

```jsx
import { useStoreValue } from '@/api/plugin/hooks';

function StatusBar() {
    const connectionStatus = useStoreValue('connection.status');

    return (
        <span class={connectionStatus() === 'online' ? 'text-success' : 'text-error'}>
            {connectionStatus()}
        </span>
    );
}
```

---

## Batch Updates

Update multiple values atomically:

```jsx
// Individual updates trigger multiple reactions
api.bridge.store.set('settings.theme', 'dark');
api.bridge.store.set('settings.fontSize', 14);
api.bridge.store.set('settings.language', 'en');

// Batch updates trigger one reaction
api.bridge.store.batch(() => {
    api.bridge.store.set('settings.theme', 'dark');
    api.bridge.store.set('settings.fontSize', 14);
    api.bridge.store.set('settings.language', 'en');
});
```

---

## Namespaced Stores

Plugins should use namespaces to avoid conflicts:

```jsx
// Plugin: file-explorer
api.bridge.store.set('file-explorer.currentPath', '/home');
api.bridge.store.set('file-explorer.showHidden', false);

// Plugin: editor
api.bridge.store.set('editor.activeFile', 'main.js');
api.bridge.store.set('editor.unsavedChanges', true);

// Shared settings (no namespace)
api.bridge.store.set('theme', 'dark');
```

### Create Namespaced Helper

```jsx
function createNamespacedStore(namespace) {
    return {
        get: (key, defaultValue) =>
            api.bridge.store.get(`${namespace}.${key}`, defaultValue),
        set: (key, value) =>
            api.bridge.store.set(`${namespace}.${key}`, value),
        watch: (key, callback, options) =>
            api.bridge.store.watch(`${namespace}.${key}`, callback, options),
        delete: (key) =>
            api.bridge.store.delete(`${namespace}.${key}`)
    };
}

// Usage in plugin
const store = createNamespacedStore('my-plugin');
store.set('count', 0);
store.watch('count', (n) => console.log('Count:', n));
```

---

## Store Patterns

### Settings Pattern

```jsx
// Define defaults
const defaultSettings = {
    theme: 'system',
    fontSize: 14,
    autoSave: true,
    autoSaveInterval: 60000
};

// Initialize with defaults
export default plugin({
    id: 'settings-plugin',
    start(api) {
        const saved = localStorage.getItem('settings');
        const settings = saved ? JSON.parse(saved) : defaultSettings;

        api.bridge.store.set('settings', settings);

        // Persist changes
        api.bridge.store.watch('settings', (settings) => {
            localStorage.setItem('settings', JSON.stringify(settings));
        }, { deep: true });

        // Provide settings service
        api.bridge.provide('settings', {
            get: (key) => api.bridge.store.get(`settings.${key}`),
            set: (key, value) => api.bridge.store.set(`settings.${key}`, value),
            reset: () => api.bridge.store.set('settings', defaultSettings)
        });
    }
});
```

### State Machine Pattern

```jsx
const states = {
    IDLE: 'idle',
    LOADING: 'loading',
    ERROR: 'error',
    SUCCESS: 'success'
};

api.bridge.store.set('upload.state', states.IDLE);
api.bridge.store.set('upload.progress', 0);
api.bridge.store.set('upload.error', null);

async function uploadFile(file) {
    api.bridge.store.batch(() => {
        api.bridge.store.set('upload.state', states.LOADING);
        api.bridge.store.set('upload.progress', 0);
        api.bridge.store.set('upload.error', null);
    });

    try {
        await upload(file, (progress) => {
            api.bridge.store.set('upload.progress', progress);
        });

        api.bridge.store.set('upload.state', states.SUCCESS);
    } catch (error) {
        api.bridge.store.batch(() => {
            api.bridge.store.set('upload.state', states.ERROR);
            api.bridge.store.set('upload.error', error.message);
        });
    }
}
```

### Counter Pattern

```jsx
// Simple counter with increment/decrement
api.bridge.store.set('counter', 0);

function increment() {
    const current = api.bridge.store.get('counter');
    api.bridge.store.set('counter', current + 1);
}

function decrement() {
    const current = api.bridge.store.get('counter');
    api.bridge.store.set('counter', current - 1);
}
```

---

## Debugging

### Log All Changes

```jsx
// In development, log all store changes
if (import.meta.env.DEV) {
    api.bridge.store.watch('*', (value, oldValue, path) => {
        console.log(`[Store] ${path}:`, oldValue, '→', value);
    });
}
```

### Get Full Store State

```jsx
// Get entire store (for debugging)
const state = api.bridge.store.getState();
console.log('Full store:', state);
```

---

## Best Practices

### 1. Use Namespaces

```jsx
// Good
api.bridge.store.set('my-plugin.count', 0);

// Avoid - could conflict with other plugins
api.bridge.store.set('count', 0);
```

### 2. Initialize on Start

```jsx
export default plugin({
    id: 'my-plugin',
    start(api) {
        // Initialize all store values
        api.bridge.store.set('my-plugin', {
            initialized: true,
            data: [],
            loading: false
        });
    }
});
```

### 3. Clean Up on Stop

```jsx
export default plugin({
    id: 'my-plugin',
    stop(api) {
        // Clean up store values
        api.bridge.store.delete('my-plugin');
    }
});
```

### 4. Use Selectors for Derived Data

```jsx
// Don't store derived data
// Bad
api.bridge.store.set('fullName', `${firstName} ${lastName}`);

// Good - compute when needed
const fullName = useStoreSelector('user', (user) =>
    `${user.firstName} ${user.lastName}`
);
```
