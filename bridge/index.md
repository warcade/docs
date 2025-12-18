# Bridge

The Bridge is WebArcade's inter-plugin communication system. It allows plugins to share data, send messages, and expose services to each other.

## Overview

```
┌─────────────┐                        ┌─────────────┐
│  Plugin A   │ ◄────── Bridge ──────► │  Plugin B   │
└─────────────┘                        └─────────────┘
       │                                      │
       │           ┌─────────────┐           │
       └──────────►│   Bridge    │◄──────────┘
                   │   Server    │
                   │ (port 3001) │
                   └─────────────┘
                          │
                   ┌──────┴──────┐
                   │  Rust DLLs  │
                   │  (backends) │
                   └─────────────┘
```

The Bridge provides three communication patterns:

| Pattern | Use Case | Example |
|---------|----------|---------|
| **Services** | Share functionality | Audio plugin provides `play()`, `stop()` methods |
| **Messages** | Broadcast events | File plugin publishes "file-saved" event |
| **Shared Store** | Share state | Settings plugin shares `theme` value |

## Quick Start

### Provide a Service

```jsx
export default plugin({
    id: 'audio-plugin',
    start(api) {
        api.provide('audio', {
            play: (url) => { /* play audio */ },
            stop: () => { /* stop audio */ },
            volume: (level) => { /* set volume */ }
        });
    }
});
```

### Use a Service

```jsx
export default plugin({
    id: 'player-plugin',
    start(api) {
        // Non-blocking - returns null if not available
        const audio = api.tryUse('audio');

        // Or wait for it (async, 10s default timeout)
        const audio = await api.use('audio');

        audio.play('song.mp3');
    }
});
```

### Publish a Message

```jsx
api.publish('file-saved', {
    path: '/path/to/file.txt',
    timestamp: Date.now()
});
```

### Subscribe to Messages

```jsx
const unsubscribe = api.subscribe('file-saved', (data) => {
    console.log(`File saved: ${data.path}`);
});
```

### Share State

```jsx
// Write to shared store
api.set('settings.theme', 'dark');

// Read from shared store
const theme = api.get('settings.theme');

// Watch for changes
api.watch('settings.theme', (newValue, oldValue, path) => {
    console.log(`Theme changed to ${newValue}`);
});
```

## Bridge Sections

### [Services](./services)
Share functionality between plugins with the service pattern.

### [Messages](./messages)
Publish and subscribe to events with the message bus.

### [Shared Store](./store)
Share reactive state across plugins.
