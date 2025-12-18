# Messages

The message bus allows plugins to communicate through events. Publishers broadcast messages, and any number of subscribers can listen.

## Publishing Messages

Use `api.bridge.publish()` to send a message:

```jsx
// Publish with data
api.bridge.publish('file-saved', {
    path: '/documents/report.txt',
    size: 1024,
    timestamp: Date.now()
});

// Publish without data
api.bridge.publish('app-ready');
```

---

## Subscribing to Messages

Use `api.bridge.subscribe()` to listen for messages:

```jsx
// Subscribe to an event
const unsubscribe = api.bridge.subscribe('file-saved', (data) => {
    console.log(`File saved: ${data.path}`);
    showNotification(`Saved ${data.path}`);
});

// Later, unsubscribe
unsubscribe();
```

### Multiple Subscribers

Any number of plugins can subscribe to the same message:

```jsx
// Plugin A
api.bridge.subscribe('file-saved', (data) => {
    updateFileTree(data.path);
});

// Plugin B
api.bridge.subscribe('file-saved', (data) => {
    refreshPreview(data.path);
});

// Plugin C
api.bridge.subscribe('file-saved', (data) => {
    trackAnalytics('file_save', data);
});
```

---

## Message Hooks

Use hooks in components:

### useEvent

Subscribe to events reactively:

```jsx
import { useEvent } from '@/api/plugin/hooks';

function NotificationCenter() {
    const [notifications, setNotifications] = createSignal([]);

    useEvent('notification', (data) => {
        setNotifications(prev => [...prev, data]);
    });

    return (
        <For each={notifications()}>
            {(n) => <Toast message={n.message} type={n.type} />}
        </For>
    );
}
```

### usePublish

Get a publish function:

```jsx
import { usePublish } from '@/api/plugin/hooks';

function SaveButton() {
    const publish = usePublish();

    const handleSave = async () => {
        await saveFile();
        publish('file-saved', { path: currentFile() });
    };

    return <button onClick={handleSave}>Save</button>;
}
```

---

## Message Channels

Organize messages using channels (namespaces):

```jsx
// File-related events
api.bridge.publish('file:created', { path });
api.bridge.publish('file:deleted', { path });
api.bridge.publish('file:renamed', { oldPath, newPath });

// User-related events
api.bridge.publish('user:login', { userId });
api.bridge.publish('user:logout', { userId });

// Subscribe to all file events
api.bridge.subscribe('file:*', (data, eventName) => {
    console.log(`File event: ${eventName}`, data);
});
```

---

## Message Replay

New subscribers can receive recent messages:

```jsx
// Publisher marks message for replay
api.bridge.publish('config-loaded', config, { replay: true });

// Later subscriber still receives it
api.bridge.subscribe('config-loaded', (config) => {
    // Gets the message even though it was published earlier
    initializeWithConfig(config);
});
```

### Replay Options

```jsx
// Keep last 5 messages for replay
api.bridge.publish('log-entry', entry, {
    replay: true,
    replayCount: 5
});

// Replay with TTL (time to live)
api.bridge.publish('status-update', status, {
    replay: true,
    replayTTL: 60000  // 1 minute
});
```

---

## Request/Response Pattern

Implement request/response over messages:

```jsx
// Service plugin
api.bridge.subscribe('db:query', async (request) => {
    const { id, sql } = request;
    try {
        const results = await executeQuery(sql);
        api.bridge.publish(`db:response:${id}`, { success: true, results });
    } catch (error) {
        api.bridge.publish(`db:response:${id}`, { success: false, error: error.message });
    }
});

// Client plugin
function queryDatabase(sql) {
    return new Promise((resolve, reject) => {
        const id = crypto.randomUUID();

        const unsubscribe = api.bridge.subscribe(`db:response:${id}`, (response) => {
            unsubscribe();
            if (response.success) {
                resolve(response.results);
            } else {
                reject(new Error(response.error));
            }
        });

        api.bridge.publish('db:query', { id, sql });
    });
}

// Usage
const users = await queryDatabase('SELECT * FROM users');
```

::: tip
For simple request/response, prefer using [Services](./services) instead. The message pattern is better for broadcasting to multiple listeners.
:::

---

## Common Patterns

### Debounced Events

Prevent flooding with rapid events:

```jsx
import { useDebounce } from '@/api/plugin/hooks';

function SearchInput() {
    const publish = usePublish();
    const debouncedPublish = useDebounce((query) => {
        publish('search:query', { query });
    }, 300);

    return (
        <input
            type="text"
            onInput={(e) => debouncedPublish(e.target.value)}
        />
    );
}
```

### Event Aggregation

Collect events and batch process:

```jsx
const pendingChanges = [];

api.bridge.subscribe('file:changed', (data) => {
    pendingChanges.push(data);
});

// Process batch every 5 seconds
setInterval(() => {
    if (pendingChanges.length > 0) {
        api.bridge.publish('files:batch-changed', {
            files: [...pendingChanges]
        });
        pendingChanges.length = 0;
    }
}, 5000);
```

### Error Events

Centralized error handling:

```jsx
// Any plugin can publish errors
api.bridge.publish('error', {
    source: 'file-plugin',
    message: 'Failed to save file',
    details: error.stack
});

// Error handler plugin subscribes
api.bridge.subscribe('error', (error) => {
    logToServer(error);
    showErrorToast(error.message);
});
```

---

## Best Practices

### 1. Use Consistent Naming

```jsx
// Good - namespace:action format
'file:created'
'file:deleted'
'user:login'
'settings:changed'

// Avoid
'fileCreated'      // No namespace
'FILE_CREATED'     // Inconsistent case
'onFileCreate'     // Handler-style naming
```

### 2. Include Context in Data

```jsx
// Good
api.bridge.publish('file:saved', {
    path: '/path/to/file.txt',
    size: 1024,
    timestamp: Date.now(),
    source: 'editor'  // Who triggered it
});

// Avoid
api.bridge.publish('file:saved', '/path/to/file.txt');
```

### 3. Clean Up Subscriptions

```jsx
export default plugin({
    id: 'my-plugin',
    start(api) {
        this.unsubscribes = [
            api.bridge.subscribe('event1', handler1),
            api.bridge.subscribe('event2', handler2)
        ];
    },
    stop() {
        this.unsubscribes.forEach(unsub => unsub());
    }
});
```

### 4. Document Your Events

```jsx
/**
 * Published when a file is saved
 * @event file:saved
 * @property {string} path - File path
 * @property {number} size - File size in bytes
 * @property {number} timestamp - Unix timestamp
 */
api.bridge.publish('file:saved', data);
```
