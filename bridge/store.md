# Shared Store

The Shared Store lets plugins share reactive state using dot-notation paths.

## Setting Values

```jsx
api.set('theme', 'dark');
api.set('settings.editor.fontSize', 14);
api.set('user', {
    id: 123,
    name: 'John',
    preferences: { notifications: true }
});
```

## Getting Values

```jsx
const theme = api.get('theme');
const fontSize = api.get('settings.editor.fontSize');

// With default value
const locale = api.get('settings.locale', 'en-US');
```

## Watching Changes

```jsx
const unwatch = api.watch('theme', (newValue, oldValue, path) => {
    console.log(`Theme changed from ${oldValue} to ${newValue}`);
});

// Stop watching
unwatch();
```

## Updating Values

```jsx
// Update with function
api.update('counter', (current) => current + 1);

// Merge objects
api.merge('settings', { theme: 'dark', fontSize: 14 });
```

## Deleting Values

```jsx
api.delete('settings.theme');
```

## Checking Existence

```jsx
if (api.has('settings.theme')) {
    // Path exists
}
```

## Batch Updates

```jsx
api.batch(() => {
    api.set('settings.theme', 'dark');
    api.set('settings.fontSize', 14);
    api.set('settings.language', 'en');
});
```

## Reactive Selectors

For use in SolidJS components:

```jsx
function ThemeDisplay() {
    const theme = api.selector('settings.theme', 'light');

    return <span>Current theme: {theme()}</span>;
}
```

## Store Hooks

```jsx
import { useStore, useStoreSelector } from '@/api/plugin/hooks';

function Settings() {
    // Get and set
    const [theme, setTheme] = useStore('settings.theme');

    return (
        <button onClick={() => setTheme('dark')}>
            Theme: {theme()}
        </button>
    );
}

function UserGreeting() {
    // Derived value
    const fullName = useStoreSelector(
        (store) => `${store.user?.firstName} ${store.user?.lastName}`
    );

    return <span>Hello, {fullName()}</span>;
}
```

## Namespacing

Plugins should namespace their store keys:

```jsx
// Good - namespaced
api.set('my-plugin.count', 0);
api.set('my-plugin.settings.enabled', true);

// Avoid - could conflict
api.set('count', 0);
```

## Direct Store Access

For advanced SolidJS usage:

```jsx
const store = api.getStore();

// Use directly in components with fine-grained reactivity
<div>{store.settings?.theme}</div>
```
