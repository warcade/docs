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
// audio-plugin/index.jsx
export default plugin({
    id: 'audio-plugin',
    start(api) {
        // Provide a service for other plugins
        api.bridge.provide('audio', {
            play: (url) => { /* play audio */ },
            stop: () => { /* stop audio */ },
            volume: (level) => { /* set volume */ }
        });
    }
});
```

### Use a Service

```jsx
// player-plugin/index.jsx
export default plugin({
    id: 'player-plugin',
    start(api) {
        // Get the audio service
        const audio = api.bridge.get('audio');

        // Use it
        audio.play('song.mp3');
    }
});
```

### Publish a Message

```jsx
// When something happens
api.bridge.publish('file-saved', {
    path: '/path/to/file.txt',
    timestamp: Date.now()
});
```

### Subscribe to Messages

```jsx
// Listen for the event
api.bridge.subscribe('file-saved', (data) => {
    console.log(`File saved: ${data.path}`);
});
```

### Share State

```jsx
// Write to shared store
api.bridge.store.set('settings.theme', 'dark');

// Read from shared store
const theme = api.bridge.store.get('settings.theme');

// Watch for changes
api.bridge.store.watch('settings.theme', (newValue, oldValue) => {
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
