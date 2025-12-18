# Services

Services let plugins expose functionality that other plugins can use.

## Providing a Service

```jsx
export default plugin({
    id: 'database-plugin',
    start(api) {
        api.provide('database', {
            query: async (sql) => { /* ... */ },
            insert: async (table, data) => { /* ... */ },
            update: async (table, id, data) => { /* ... */ },
            delete: async (table, id) => { /* ... */ }
        });
    }
});
```

## Consuming a Service

### Non-blocking (tryUse)

Returns the service or `null` if not available:

```jsx
const db = api.tryUse('database');
if (db) {
    const users = await db.query('SELECT * FROM users');
}
```

### Async with timeout (use)

Waits for the service to become available:

```jsx
// Default 10 second timeout
const db = await api.use('database');

// Custom timeout
const db = await api.use('database', 5000);
```

### Check if available

```jsx
if (api.hasService('database')) {
    // Service exists
}
```

## Removing a Service

```jsx
export default plugin({
    id: 'my-plugin',
    start(api) {
        api.provide('my-service', myService);
    },
    stop(api) {
        api.unprovide('my-service');
    }
});
```

## Service Hooks

Use hooks in components:

```jsx
import { useService, useOptionalService } from 'webarcade';

function UserList() {
    // Throws if service not found
    const db = useService('database');

    // Returns null if not found
    const analytics = useOptionalService('analytics');
}
```

## Patterns

### Singleton Service

```jsx
api.provide('config', {
    get: (key) => config[key],
    set: (key, value) => { config[key] = value }
});
```

### Factory Service

```jsx
api.provide('logger', {
    create: (namespace) => ({
        log: (msg) => console.log(`[${namespace}] ${msg}`),
        error: (msg) => console.error(`[${namespace}] ${msg}`)
    })
});

// Usage
const log = api.tryUse('logger').create('my-plugin');
log.log('Hello');  // [my-plugin] Hello
```

### Async Service

```jsx
api.provide('http', {
    get: async (url) => {
        const response = await fetch(url);
        return response.json();
    },
    post: async (url, data) => {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        return response.json();
    }
});
```
