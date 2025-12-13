# Bridge API

The Bridge API enables communication between plugins. It has three parts:

1. **Services** - Share objects/functionality between plugins
2. **Message Bus** - Publish/subscribe event system
3. **Shared Store** - Reactive shared state

## Services

Services let one plugin provide functionality that other plugins can use.

### How Services Work

```
┌──────────────────┐                    ┌──────────────────┐
│   Audio Plugin   │                    │   Game Plugin    │
│                  │                    │                  │
│  api.provide(    │◄───── uses ───────│  const audio =   │
│    'audio',      │                    │    await         │
│    audioService  │                    │    api.use(      │
│  );              │                    │      'audio'     │
│                  │                    │    );            │
│                  │                    │                  │
│                  │                    │  audio.play()    │
└──────────────────┘                    └──────────────────┘
```

### api.provide()

Register a service for other plugins to use.

```jsx
api.provide(name, service)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Unique name for the service |
| `service` | `object` | Object with methods/properties to share |

**Example: Providing an audio service**

```jsx
// audio-plugin/index.jsx
export default plugin({
    id: 'audio-plugin',
    name: 'Audio Plugin',
    version: '1.0.0',

    start(api) {
        // Create the service object
        const audioService = {
            currentTrack: null,

            play(url) {
                this.currentTrack = new Audio(url);
                this.currentTrack.play();
            },

            pause() {
                this.currentTrack?.pause();
            },

            stop() {
                this.currentTrack?.pause();
                this.currentTrack = null;
            },

            setVolume(level) {
                if (this.currentTrack) {
                    this.currentTrack.volume = level;
                }
            }
        };

        // Register the service
        api.provide('audio', audioService);
    }
});
```

### api.use()

Get a service from another plugin. **Waits** if the service isn't ready yet.

```jsx
const service = await api.use(name, timeout?)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | `string` | - | Name of the service |
| `timeout` | `number` | `5000` | Max milliseconds to wait |

**Returns:** `Promise<object>` - The service object

**Example: Using the audio service**

```jsx
// game-plugin/index.jsx
export default plugin({
    id: 'game-plugin',
    name: 'Game Plugin',
    version: '1.0.0',

    async start(api) {
        // Wait for the audio service (up to 5 seconds)
        const audio = await api.use('audio');

        // Now we can use it
        audio.play('/sounds/background-music.mp3');
        audio.setVolume(0.5);
    }
});
```

**With custom timeout:**

```jsx
try {
    // Wait up to 10 seconds
    const audio = await api.use('audio', 10000);
    audio.play('/music.mp3');
} catch (error) {
    console.error('Audio service not available');
}
```

### api.tryUse()

Get a service **immediately** without waiting. Returns `null` if not available.

```jsx
const service = api.tryUse(name)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Name of the service |

**Returns:** `object | null`

**Example:**

```jsx
function playSound(sound) {
    const audio = api.tryUse('audio');
    if (audio) {
        audio.play(sound);
    } else {
        console.log('Audio not available');
    }
}
```

### api.hasService()

Check if a service exists.

```jsx
const exists = api.hasService(name)
```

**Returns:** `boolean`

**Example:**

```jsx
if (api.hasService('audio')) {
    const audio = await api.use('audio');
    audio.play('/beep.mp3');
}
```

### api.unprovide()

Remove a service you previously provided.

```jsx
api.unprovide(name)
```

**Example:**

```jsx
stop(api) {
    // Clean up when plugin stops
    api.unprovide('audio');
}
```

---

## Message Bus

The message bus is a publish/subscribe system for sending events between plugins.

### How Messages Work

```
┌──────────────────┐     publish      ┌──────────────────┐
│   File Plugin    │ ────────────────►│    Channel       │
│                  │ 'file:saved'     │  'file:saved'    │
│  api.publish(    │                  │                  │
│    'file:saved', │                  │                  │
│    { path }      │                  │                  │
│  );              │                  │                  │
└──────────────────┘                  └────────┬─────────┘
                                               │
                    ┌──────────────────────────┼──────────────────────────┐
                    │                          │                          │
                    ▼                          ▼                          ▼
          ┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
          │   Git Plugin     │      │   Backup Plugin  │      │   Linter Plugin  │
          │                  │      │                  │      │                  │
          │  api.subscribe(  │      │  api.subscribe(  │      │  api.subscribe(  │
          │    'file:saved'  │      │    'file:saved'  │      │    'file:saved'  │
          │  );              │      │  );              │      │  );              │
          └──────────────────┘      └──────────────────┘      └──────────────────┘
```

### api.subscribe()

Listen for messages on a channel.

```jsx
const unsubscribe = api.subscribe(channel, callback)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `channel` | `string` | Channel name to listen on |
| `callback` | `(data, meta) => void` | Function called when message received |

**Returns:** `() => void` - Call this to unsubscribe

**Callback parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | `any` | The message data |
| `meta` | `object` | Metadata: `{ timestamp, sender }` |

**Example:**

```jsx
start(api) {
    // Subscribe to file events
    const unsubscribe = api.subscribe('file:saved', (data, meta) => {
        console.log(`File saved: ${data.path}`);
        console.log(`Time: ${meta.timestamp}`);
        console.log(`Sender: ${meta.sender}`);
    });

    // Store unsubscribe for cleanup
    this.unsubscribe = unsubscribe;
}

stop(api) {
    // Clean up subscription
    this.unsubscribe?.();
}
```

### api.publish()

Send a message to all subscribers on a channel.

```jsx
api.publish(channel, data)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `channel` | `string` | Channel to publish to |
| `data` | `any` | Data to send (any type) |

**Example:**

```jsx
function saveFile(path, content) {
    // Save the file...
    fs.writeFile(path, content);

    // Notify other plugins
    api.publish('file:saved', {
        path: path,
        content: content,
        size: content.length
    });
}
```

### api.once()

Subscribe to a channel for **one message only**. Automatically unsubscribes after receiving.

```jsx
const unsubscribe = api.once(channel, callback)
```

**Example:**

```jsx
// Wait for game to be ready (one-time)
api.once('game:ready', (data) => {
    console.log('Game is ready!');
    startPlaying();
});
```

### api.waitFor()

Wait for a message using Promises. Useful with async/await.

```jsx
const { data, meta } = await api.waitFor(channel, timeout?)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `channel` | `string` | - | Channel to wait on |
| `timeout` | `number` | `5000` | Max milliseconds to wait |

**Returns:** `Promise<{ data, meta }>`

**Example:**

```jsx
async function waitForGameReady() {
    try {
        const { data } = await api.waitFor('game:ready', 10000);
        console.log('Game ready with config:', data);
    } catch (error) {
        console.error('Game did not start in time');
    }
}
```

### api.createChannel()

Configure a channel with special options.

```jsx
api.createChannel(channel, options)
```

| Option | Type | Description |
|--------|------|-------------|
| `replay` | `number` | Number of past messages to send to new subscribers |

**Example: Chat channel with message history**

```jsx
// Create a channel that replays last 50 messages
api.createChannel('chat:messages', { replay: 50 });

// Later, when a new plugin subscribes, it receives the last 50 messages immediately
api.subscribe('chat:messages', (message) => {
    displayMessage(message);
});
```

---

## Shared Store

The shared store is reactive state that any plugin can read and write.

### How the Store Works

```
┌─────────────────────────────────────────────────────────────┐
│                      Shared Store                           │
│                                                             │
│   settings.theme = 'dark'                                   │
│   settings.fontSize = 14                                    │
│   player.health = 100                                       │
│   player.position = { x: 10, y: 20 }                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
         ▲                    ▲                    ▲
         │ read/write         │ read/write         │ read/write
         │                    │                    │
┌────────┴────────┐  ┌────────┴────────┐  ┌────────┴────────┐
│   Settings      │  │   Theme         │  │   Game          │
│   Plugin        │  │   Plugin        │  │   Plugin        │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### api.set()

Set a value in the store.

```jsx
api.set(path, value)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `path` | `string` | Dot-notation path (e.g., `'player.health'`) |
| `value` | `any` | Value to set |

**Examples:**

```jsx
// Simple values
api.set('theme', 'dark');
api.set('fontSize', 14);

// Nested paths
api.set('player.health', 100);
api.set('player.position.x', 50);
api.set('player.position.y', 100);

// Objects
api.set('player', {
    health: 100,
    mana: 50,
    position: { x: 0, y: 0 }
});

// Arrays
api.set('inventory', ['sword', 'shield', 'potion']);
api.set('inventory.0', 'better-sword');
```

### api.get()

Get a value from the store.

```jsx
const value = api.get(path, defaultValue?)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `path` | `string` | Dot-notation path |
| `defaultValue` | `any` | Value to return if path doesn't exist |

**Returns:** The value or default

**Examples:**

```jsx
// Get values
const theme = api.get('theme');
const health = api.get('player.health');
const x = api.get('player.position.x');

// With defaults
const volume = api.get('settings.volume', 1.0);
const name = api.get('player.name', 'Unknown');
```

### api.update()

Update a value using a function (useful for counters, etc.).

```jsx
api.update(path, updateFn)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `path` | `string` | Path to update |
| `updateFn` | `(currentValue) => newValue` | Function that receives current value and returns new value |

**Examples:**

```jsx
// Increment
api.update('player.health', (h) => h + 10);

// Decrement
api.update('player.health', (h) => Math.max(0, h - 10));

// Toggle
api.update('settings.darkMode', (v) => !v);

// Array operations
api.update('inventory', (items) => [...items, 'new-item']);
api.update('inventory', (items) => items.filter(i => i !== 'used-item'));
```

### api.merge()

Shallow merge an object into a path.

```jsx
api.merge(path, object)
```

**Example:**

```jsx
// Current: player = { health: 100, mana: 50 }
api.merge('player', { score: 500, level: 5 });
// Result: player = { health: 100, mana: 50, score: 500, level: 5 }
```

### api.delete()

Delete a path from the store.

```jsx
api.delete(path)
```

**Example:**

```jsx
api.delete('player.tempBuff');
api.delete('session.token');
```

### api.has()

Check if a path exists.

```jsx
const exists = api.has(path)
```

**Returns:** `boolean`

**Example:**

```jsx
if (api.has('player.powerUp')) {
    usePowerUp();
}
```

### api.watch()

Watch for changes at a path. Called whenever the value changes.

```jsx
const unwatch = api.watch(path, callback)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `path` | `string` | Path to watch |
| `callback` | `(newValue, oldValue, path) => void` | Called on change |

**Returns:** `() => void` - Call to stop watching

**Example:**

```jsx
// Watch player health
const unwatch = api.watch('player.health', (newHealth, oldHealth) => {
    console.log(`Health changed: ${oldHealth} → ${newHealth}`);

    if (newHealth <= 0) {
        gameOver();
    }

    if (newHealth < 20) {
        showLowHealthWarning();
    }
});

// Later: stop watching
unwatch();
```

### api.selector()

Get a **reactive** value for use in SolidJS components.

```jsx
const getValue = api.selector(path, defaultValue?)
```

**Returns:** `() => value` - A getter function (SolidJS signal-like)

**Example: Reactive health bar**

```jsx
function HealthBar() {
    // This automatically updates when player.health changes
    const health = api.selector('player.health', 100);

    return (
        <div class="w-full h-4 bg-base-300 rounded">
            <div
                class="h-full bg-success rounded transition-all"
                style={{ width: `${health()}%` }}
            />
        </div>
    );
}
```

**Example: Reactive settings**

```jsx
function ThemeToggle() {
    const darkMode = api.selector('settings.darkMode', false);

    return (
        <button
            class="btn"
            onClick={() => api.update('settings.darkMode', v => !v)}
        >
            {darkMode() ? 'Light Mode' : 'Dark Mode'}
        </button>
    );
}
```

### api.batch()

Batch multiple updates into one reactive update.

```jsx
api.batch(updateFn)
```

**Why use batch?** Without batching, each `set()` triggers a reactive update. Batching combines them.

**Example:**

```jsx
// Without batch: 4 separate updates (4 re-renders)
api.set('player.health', 100);
api.set('player.mana', 50);
api.set('player.stamina', 75);
api.set('player.position', { x: 0, y: 0 });

// With batch: 1 update (1 re-render)
api.batch(() => {
    api.set('player.health', 100);
    api.set('player.mana', 50);
    api.set('player.stamina', 75);
    api.set('player.position', { x: 0, y: 0 });
});
```

### api.getStore()

Get the raw SolidJS store (advanced use).

```jsx
const store = api.getStore()
```

**Example:**

```jsx
import { createEffect } from 'solid-js';

const store = api.getStore();

// Use SolidJS effects directly on the store
createEffect(() => {
    console.log('Player health:', store.player?.health);
});
```

---

## Complete Example

Here's a complete example using all three communication patterns:

```jsx
// game-manager-plugin/index.jsx
import { plugin } from '@/api/plugin';

export default plugin({
    id: 'game-manager',
    name: 'Game Manager',
    version: '1.0.0',

    start(api) {
        // 1. SHARED STORE: Initialize game state
        api.set('game', {
            status: 'menu',
            score: 0,
            level: 1,
            player: {
                health: 100,
                position: { x: 0, y: 0 }
            }
        });

        // 2. SERVICE: Provide game management service
        api.provide('game', {
            start: () => {
                api.batch(() => {
                    api.set('game.status', 'playing');
                    api.set('game.score', 0);
                    api.set('game.player.health', 100);
                });
                api.publish('game:started', { level: api.get('game.level') });
            },

            pause: () => {
                api.set('game.status', 'paused');
                api.publish('game:paused', {});
            },

            resume: () => {
                api.set('game.status', 'playing');
                api.publish('game:resumed', {});
            },

            gameOver: () => {
                api.set('game.status', 'gameover');
                api.publish('game:over', { score: api.get('game.score') });
            },

            addScore: (points) => {
                api.update('game.score', s => s + points);
            },

            damage: (amount) => {
                api.update('game.player.health', h => {
                    const newHealth = Math.max(0, h - amount);
                    if (newHealth <= 0) {
                        this.gameOver();
                    }
                    return newHealth;
                });
            }
        });

        // 3. MESSAGES: Subscribe to game events
        api.subscribe('enemy:killed', (data) => {
            const game = api.tryUse('game');
            game?.addScore(data.points);
        });

        // Watch for low health
        api.watch('game.player.health', (health) => {
            if (health < 20 && health > 0) {
                api.publish('game:low-health', { health });
            }
        });
    },

    stop(api) {
        api.unprovide('game');
    }
});
```

```jsx
// ui-plugin/index.jsx - Uses the game manager
import { plugin } from '@/api/plugin';

function GameUI() {
    const status = api.selector('game.status', 'menu');
    const score = api.selector('game.score', 0);
    const health = api.selector('game.player.health', 100);

    return (
        <div class="p-4">
            <div>Status: {status()}</div>
            <div>Score: {score()}</div>
            <div>Health: {health()}</div>
        </div>
    );
}

export default plugin({
    id: 'ui-plugin',
    name: 'UI Plugin',
    version: '1.0.0',

    async start(api) {
        // Get the game service
        const game = await api.use('game');

        // Subscribe to events
        api.subscribe('game:low-health', () => {
            // Flash the screen red
            document.body.classList.add('low-health');
            setTimeout(() => document.body.classList.remove('low-health'), 500);
        });

        api.subscribe('game:over', (data) => {
            alert(`Game Over! Score: ${data.score}`);
        });

        // Register UI
        api.add({ panel: 'tab', label: 'Game' });
        api.add({ panel: 'viewport', id: 'game', component: GameUI });
    }
});
```
