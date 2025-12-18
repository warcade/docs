# Services

Services let plugins expose functionality that other plugins can use. Think of them like APIs between plugins.

## Providing a Service

Use `api.bridge.provide()` to expose a service:

```jsx
export default plugin({
    id: 'database-plugin',
    name: 'Database Plugin',
    version: '1.0.0',

    start(api) {
        // Create the service object
        const database = {
            query: async (sql) => {
                // Execute query
                return results;
            },
            insert: async (table, data) => {
                // Insert data
                return id;
            },
            update: async (table, id, data) => {
                // Update data
            },
            delete: async (table, id) => {
                // Delete data
            }
        };

        // Provide it to other plugins
        api.bridge.provide('database', database);
    }
});
```

---

## Consuming a Service

Use `api.bridge.get()` to get a service:

```jsx
export default plugin({
    id: 'user-plugin',
    start(api) {
        const db = api.bridge.get('database');

        // Use the service
        const users = await db.query('SELECT * FROM users');
    }
});
```

### Waiting for Services

If a service might not be available yet, use `api.bridge.when()`:

```jsx
// Wait for service to become available
const db = await api.bridge.when('database');

// Now safe to use
const users = await db.query('SELECT * FROM users');
```

Or with a timeout:

```jsx
try {
    const db = await api.bridge.when('database', { timeout: 5000 });
} catch (e) {
    console.error('Database service not available');
}
```

### Checking Availability

```jsx
// Check if service exists
if (api.bridge.has('database')) {
    const db = api.bridge.get('database');
    // Use it
}
```

---

## Service Hooks

Use hooks in components for reactive service access:

### useService

Requires the service to exist (throws if not found):

```jsx
import { useService } from '@/api/plugin/hooks';

function UserList() {
    const db = useService('database');

    const [users, setUsers] = createSignal([]);

    onMount(async () => {
        const data = await db.query('SELECT * FROM users');
        setUsers(data);
    });

    return (
        <For each={users()}>
            {(user) => <div>{user.name}</div>}
        </For>
    );
}
```

### useOptionalService

Returns `null` if service doesn't exist:

```jsx
import { useOptionalService } from '@/api/plugin/hooks';

function AudioControls() {
    const audio = useOptionalService('audio');

    return (
        <Show when={audio} fallback={<span>No audio available</span>}>
            <button onClick={() => audio.play()}>Play</button>
            <button onClick={() => audio.stop()}>Stop</button>
        </Show>
    );
}
```

### useServiceReady

Waits for service with loading state:

```jsx
import { useServiceReady } from '@/api/plugin/hooks';

function Dashboard() {
    const { service: analytics, ready } = useServiceReady('analytics');

    return (
        <Show when={ready()} fallback={<Loading />}>
            <AnalyticsChart data={analytics.getData()} />
        </Show>
    );
}
```

---

## Service Patterns

### Singleton Service

Most common - one instance shared by all:

```jsx
api.bridge.provide('config', {
    get: (key) => config[key],
    set: (key, value) => { config[key] = value }
});
```

### Factory Service

Creates new instances:

```jsx
api.bridge.provide('logger', {
    create: (namespace) => ({
        log: (msg) => console.log(`[${namespace}] ${msg}`),
        error: (msg) => console.error(`[${namespace}] ${msg}`)
    })
});

// Usage
const log = api.bridge.get('logger').create('my-plugin');
log.log('Hello');  // [my-plugin] Hello
```

### Async Service

Services can have async methods:

```jsx
api.bridge.provide('http', {
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

### Stateful Service

Services can maintain internal state:

```jsx
function createCartService() {
    const items = new Map();

    return {
        add(product, quantity = 1) {
            const current = items.get(product.id) || 0;
            items.set(product.id, current + quantity);
        },
        remove(productId) {
            items.delete(productId);
        },
        getItems() {
            return Array.from(items.entries());
        },
        getTotal() {
            // Calculate total
        }
    };
}

api.bridge.provide('cart', createCartService());
```

---

## Service Dependencies

Handle dependencies between services:

```jsx
export default plugin({
    id: 'analytics-plugin',
    start(api) {
        // Wait for required services
        Promise.all([
            api.bridge.when('database'),
            api.bridge.when('auth')
        ]).then(([db, auth]) => {
            // Now provide analytics service
            api.bridge.provide('analytics', {
                track: async (event, data) => {
                    const userId = auth.getCurrentUser()?.id;
                    await db.insert('events', {
                        event,
                        data,
                        userId,
                        timestamp: Date.now()
                    });
                }
            });
        });
    }
});
```

---

## Removing Services

Clean up when your plugin stops:

```jsx
export default plugin({
    id: 'my-plugin',
    start(api) {
        api.bridge.provide('my-service', myService);
    },
    stop(api) {
        api.bridge.remove('my-service');
    }
});
```

---

## Best Practices

### 1. Document Your Services

```jsx
/**
 * Audio service for playing sounds
 *
 * @service audio
 * @method play(url: string) - Play audio from URL
 * @method stop() - Stop current playback
 * @method volume(level: number) - Set volume (0-1)
 */
api.bridge.provide('audio', audioService);
```

### 2. Use Descriptive Names

```jsx
// Good
api.bridge.provide('user-authentication', authService);
api.bridge.provide('file-system', fsService);

// Avoid
api.bridge.provide('auth', authService);  // Too short
api.bridge.provide('svc1', service);       // Not descriptive
```

### 3. Handle Errors Gracefully

```jsx
const db = api.bridge.get('database');

try {
    await db.query('SELECT * FROM users');
} catch (error) {
    if (error.code === 'CONNECTION_LOST') {
        // Handle reconnection
    } else {
        throw error;
    }
}
```

### 4. Version Your Services

```jsx
api.bridge.provide('database:v2', {
    // New API
});

// Consumers can migrate gradually
const db = api.bridge.get('database:v2') || api.bridge.get('database');
```
