# Messages

The message bus allows plugins to communicate through events.

## Publishing Messages

```jsx
api.publish('file-saved', {
    path: '/documents/report.txt',
    size: 1024,
    timestamp: Date.now()
});

// Without data
api.publish('app-ready');
```

## Subscribing to Messages

```jsx
const unsubscribe = api.subscribe('file-saved', (data, meta) => {
    console.log(`File saved: ${data.path}`);
    console.log(`Timestamp: ${meta.timestamp}`);
});

// Later, unsubscribe
unsubscribe();
```

## One-time Subscription

```jsx
api.once('config-loaded', (config) => {
    initialize(config);
});
```

## Promise-based Waiting

```jsx
// Wait for a message (10s default timeout)
const { data, meta } = await api.waitFor('config-loaded');

// Custom timeout
const { data } = await api.waitFor('config-loaded', 5000);
```

## Message Replay

New subscribers can receive recent messages:

```jsx
// Create channel with replay (keeps last 5 messages)
api.createChannel('log-entry', { replay: 5 });

// Publish messages
api.publish('log-entry', { msg: 'First' });
api.publish('log-entry', { msg: 'Second' });

// Later subscriber receives both
api.subscribe('log-entry', (data) => {
    console.log(data.msg);  // 'First', then 'Second'
});
```

## Message Hooks

```jsx
import { useEvent, usePublish } from 'webarcade';

function NotificationCenter() {
    // Subscribe to events with auto-cleanup
    useEvent('notification', (data) => {
        showToast(data.message);
    });
}

function SaveButton() {
    const publish = usePublish();

    const handleSave = async () => {
        await saveFile();
        publish('file-saved', { path: currentFile() });
    };

    return <button onClick={handleSave}>Save</button>;
}
```

## Naming Conventions

Use namespaced channel names:

```jsx
// Good
'file:created'
'file:deleted'
'user:login'
'settings:changed'

// Avoid
'fileCreated'
'FILE_CREATED'
```

## Metadata

Published messages automatically include metadata:

```jsx
api.subscribe('my-event', (data, meta) => {
    meta.timestamp  // When message was published
    meta.channel    // Channel name
});
```
