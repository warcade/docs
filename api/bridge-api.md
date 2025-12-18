# Bridge API

The Bridge API enables communication between plugins. Use it in plugin lifecycle hooks (`start()`, `stop()`) or non-component code.

::: tip Use Hooks in Components
For component-based code, use **[Plugin Hooks](/api/hooks)** instead. Hooks provide automatic cleanup and SolidJS reactivity.
:::

## Services

Share functionality between plugins.

### api.provide()

Register a service for other plugins to use.

```jsx
api.provide('audio', {
    play(url) { /* ... */ },
    pause() { /* ... */ }
});
```

### api.use()

Get a service (waits if not ready).

```jsx
const audio = await api.use('audio');        // Wait up to 5s (default)
const audio = await api.use('audio', 10000); // Wait up to 10s
```

### api.tryUse()

Get a service immediately (returns `null` if unavailable).

```jsx
const audio = api.tryUse('audio');
if (audio) audio.play('/sound.mp3');
```

### api.unprovide()

Remove a service.

```jsx
api.unprovide('audio');
```

---

## Message Bus

Publish/subscribe events between plugins.

### api.subscribe()

Listen for messages. Returns unsubscribe function.

```jsx
const unsub = api.subscribe('file:saved', (data, meta) => {
    console.log('Saved:', data.path);
});

// Later: unsub();
```

### api.publish()

Send a message to all subscribers.

```jsx
api.publish('file:saved', { path: '/my/file.txt' });
```

### api.once()

Subscribe for one message only.

```jsx
api.once('game:ready', (data) => {
    console.log('Game started!');
});
```

### api.waitFor()

Wait for a message with async/await.

```jsx
const { data } = await api.waitFor('game:ready', 10000);
```

---

## Shared Store

Reactive state shared between plugins.

### api.set() / api.get()

Write and read values using dot-notation paths.

```jsx
api.set('player.health', 100);
api.set('player.position', { x: 0, y: 0 });

const health = api.get('player.health');
const name = api.get('player.name', 'Unknown'); // With default
```

### api.update()

Update a value with a function.

```jsx
api.update('player.health', h => h - 10);
api.update('settings.darkMode', v => !v);
```

### api.watch()

Watch for changes. Returns unwatch function.

```jsx
const unwatch = api.watch('player.health', (newVal, oldVal) => {
    if (newVal <= 0) gameOver();
});
```

### api.selector()

Get a reactive value for SolidJS components.

```jsx
function HealthBar() {
    const health = api.selector('player.health', 100);
    return <div style={{ width: `${health()}%` }} />;
}
```

### api.batch()

Batch multiple updates into one reactive update.

```jsx
api.batch(() => {
    api.set('player.health', 100);
    api.set('player.mana', 50);
    api.set('player.score', 0);
});
```

---

## Quick Reference

| Method | Description |
|--------|-------------|
| `api.provide(name, service)` | Register a service |
| `api.use(name, timeout?)` | Get service (async, waits) |
| `api.tryUse(name)` | Get service (sync, nullable) |
| `api.unprovide(name)` | Remove a service |
| `api.subscribe(channel, fn)` | Listen for messages |
| `api.publish(channel, data)` | Send a message |
| `api.once(channel, fn)` | Listen for one message |
| `api.waitFor(channel, timeout?)` | Await a message |
| `api.set(path, value)` | Set store value |
| `api.get(path, default?)` | Get store value |
| `api.update(path, fn)` | Update with function |
| `api.watch(path, fn)` | Watch for changes |
| `api.selector(path, default?)` | Reactive getter |
| `api.batch(fn)` | Batch updates |
