# Plugin Hooks

WebArcade provides a set of **reactive hooks** for plugin development. These hooks simplify common patterns like service access, event handling, and state management by providing automatic cleanup and SolidJS integration.

::: tip Recommended Approach
Hooks are the **preferred way** to access services, subscribe to events, and manage shared state in your plugin components. They provide automatic cleanup and integrate seamlessly with SolidJS reactivity.
:::

## Creating Services

Before consuming services with hooks, you need to **provide** them. Services are created in your plugin's `start()` lifecycle hook using `api.provide()`:

```jsx
import { plugin } from 'webarcade';
import { createSignal } from 'solid-js';

export default plugin({
    id: 'audio-plugin',
    name: 'Audio Plugin',
    version: '1.0.0',

    start(api) {
        // Create reactive state for the service
        const [volume, setVolume] = createSignal(1.0);
        const [playing, setPlaying] = createSignal(false);

        // Create the service object
        const audioService = {
            // Expose signals for reactive access
            volume,
            playing,

            // Methods
            play(url) {
                console.log('Playing:', url);
                setPlaying(true);
            },

            pause() {
                setPlaying(false);
            },

            setVolume(level) {
                setVolume(Math.max(0, Math.min(1, level)));
            }
        };

        // Register the service for other plugins
        api.provide('audio', audioService);
    },

    stop(api) {
        // Clean up when plugin unloads
        api.unprovide('audio');
    }
});
```

::: tip Reactive Services
When creating services, expose SolidJS signals (like `volume` and `playing` above) as properties. This allows consumers using `useReactiveService()` to get automatic reactivity when your service state changes.
:::

Now other plugins can consume this service using hooks:

```jsx
function VolumeControl() {
    const audio = useReactiveService('audio');

    return (
        <div>
            {/* Reactive - updates when audio.playing() changes */}
            <span>{audio.playing() ? 'Playing' : 'Paused'}</span>

            <input
                type="range"
                min="0"
                max="100"
                value={audio.volume() * 100}
                onInput={(e) => audio.setVolume(e.target.value / 100)}
            />
        </div>
    );
}
```

---

## Service Hooks

Service hooks provide reactive access to services provided by other plugins.

### useService()

Access a **required** service. Throws an error if the service isn't available after the timeout.

```jsx
import { useService } from 'webarcade';

function MyComponent() {
    const getAudio = useService('audio');

    const playSound = () => {
        const audio = getAudio(); // Throws if not ready
        audio.play('/sounds/click.mp3');
    };

    return <button onClick={playSound}>Play Sound</button>;
}
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `serviceName` | `string` | - | Name of the service to use |
| `timeout` | `number` | `5000` | Max milliseconds to wait |

**Returns:** `() => service` - A getter function that returns the service or throws

---

### useOptionalService()

Access an **optional** service. Returns `null` if the service isn't available.

```jsx
import { useOptionalService } from 'webarcade';

function MyComponent() {
    const audio = useOptionalService('audio');

    const playSound = () => {
        if (audio()) {
            audio().play('/sounds/click.mp3');
        } else {
            console.log('Audio not available');
        }
    };

    return <button onClick={playSound}>Play Sound</button>;
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `serviceName` | `string` | Name of the service to use |

**Returns:** `() => service | null` - A signal that returns the service or null

---

### useServiceReady()

Execute a callback when a service becomes available. Returns a signal indicating ready state.

```jsx
import { useServiceReady } from 'webarcade';

function GameView() {
    const ready = useServiceReady('game-engine', (engine) => {
        console.log('Engine ready!');
        engine.initialize();
    });

    return (
        <div>
            {ready() ? 'Engine loaded!' : 'Loading engine...'}
        </div>
    );
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `serviceName` | `string` | Name of the service to wait for |
| `onReady` | `(service) => void` | Callback when service is ready |

**Returns:** `() => boolean` - A signal indicating if service is ready

---

### useReactiveService()

Access a service with **full reactivity**. Returns a proxy that forwards all access to the service and maintains SolidJS reactivity.

This is the **recommended** way to access services in components.

```jsx
import { useReactiveService } from 'webarcade';

function GameUI() {
    const engine = useReactiveService('game-engine');

    return (
        <div class="p-4">
            {/* Automatically reactive - updates when engine state changes */}
            <div>Meshes: {engine.meshes().length}</div>
            <div>Selected: {engine.selectedObject()?.name || 'None'}</div>

            {/* Call methods directly */}
            <button onClick={() => engine.createCube()}>
                Add Cube
            </button>
        </div>
    );
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `serviceName` | `string` | Name of the service to use |

**Returns:** `Proxy` - A reactive proxy to the service

**How it works:**
- Automatically waits for the service to become available
- Property access is forwarded to the underlying service
- Signal properties (getters) remain reactive
- Methods are bound to the service context
- Classes are returned directly without binding

---

## Event Hooks

Event hooks provide reactive pub/sub patterns with automatic cleanup.

### useEvent()

Subscribe to an event channel with **automatic cleanup** when the component unmounts.

```jsx
import { useEvent } from 'webarcade';

function NotificationHandler() {
    const [messages, setMessages] = createSignal([]);

    // Automatically cleaned up when component unmounts
    useEvent('notification:received', (data) => {
        setMessages(prev => [...prev, data.message]);
    });

    return (
        <ul>
            {messages().map(msg => <li>{msg}</li>)}
        </ul>
    );
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `channel` | `string` | Event channel to subscribe to |
| `callback` | `(data, meta) => void` | Handler called when event is published |

**Callback parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | `any` | The event data |
| `meta` | `object` | Metadata: `{ timestamp, sender }` |

---

### usePublish()

Get a publish function for an event channel.

```jsx
import { usePublish } from 'webarcade';

function FileEditor() {
    const publishSave = usePublish('file:saved');

    const saveFile = async () => {
        await writeFile(path, content);
        publishSave({ path, size: content.length });
    };

    return <button onClick={saveFile}>Save</button>;
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `channel` | `string` | Event channel to publish to |

**Returns:** `(data, meta?) => void` - A function to publish events

---

## Store Hooks

Store hooks provide reactive access to the shared store.

### useStore()

Access a value from the shared store with **reactivity**. Returns a getter and setter tuple.

```jsx
import { useStore } from 'webarcade';

function ThemeToggle() {
    const [theme, setTheme] = useStore('settings.theme', 'dark');

    return (
        <button onClick={() => setTheme(theme() === 'dark' ? 'light' : 'dark')}>
            Current: {theme()}
        </button>
    );
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `path` | `string` | Dot-notation path in the store |
| `defaultValue` | `any` | Value to use if path doesn't exist |

**Returns:** `[getter, setter]` - A tuple of getter function and setter function

**Example with complex state:**

```jsx
function PlayerStats() {
    const [health, setHealth] = useStore('player.health', 100);
    const [score, setScore] = useStore('player.score', 0);

    const takeDamage = (amount) => {
        setHealth(Math.max(0, health() - amount));
    };

    const addPoints = (points) => {
        setScore(score() + points);
    };

    return (
        <div>
            <div>Health: {health()}</div>
            <div>Score: {score()}</div>
        </div>
    );
}
```

---

### useStoreSelector()

Create a **derived/computed** value from the store.

```jsx
import { useStoreSelector } from 'webarcade';

function PlayerInfo() {
    const fullName = useStoreSelector(
        (store) => `${store.player?.firstName || ''} ${store.player?.lastName || ''}`
    );

    const isLowHealth = useStoreSelector(
        (store) => (store.player?.health || 100) < 20
    );

    return (
        <div>
            <span>{fullName()}</span>
            {isLowHealth() && <span class="text-error">Low Health!</span>}
        </div>
    );
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `selector` | `(store) => value` | Function that derives a value from the store |

**Returns:** `() => value` - A memo that updates when selected data changes

---

## Utility Hooks

Utility hooks for common patterns.

### useDebounce()

Create a **debounced** version of a function. Automatically cleaned up on unmount.

```jsx
import { useDebounce } from 'webarcade';

function SearchInput() {
    const [query, setQuery] = createSignal('');

    const search = useDebounce((term) => {
        console.log('Searching for:', term);
        // Perform search...
    }, 300);

    return (
        <input
            value={query()}
            onInput={(e) => {
                setQuery(e.target.value);
                search(e.target.value);
            }}
            placeholder="Search..."
        />
    );
}
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `fn` | `function` | - | Function to debounce |
| `delay` | `number` | `300` | Debounce delay in milliseconds |

**Returns:** `(...args) => void` - Debounced function

---

### useThrottle()

Create a **throttled** version of a function. Automatically cleaned up on unmount.

```jsx
import { useThrottle } from 'webarcade';

function MouseTracker() {
    const [position, setPosition] = createSignal({ x: 0, y: 0 });

    const updatePosition = useThrottle((e) => {
        setPosition({ x: e.clientX, y: e.clientY });
    }, 100);

    onMount(() => {
        window.addEventListener('mousemove', updatePosition);
        onCleanup(() => window.removeEventListener('mousemove', updatePosition));
    });

    return <div>Position: {position().x}, {position().y}</div>;
}
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `fn` | `function` | - | Function to throttle |
| `delay` | `number` | `100` | Throttle delay in milliseconds |

**Returns:** `(...args) => void` - Throttled function

---

## Complete Example

Here's a complete plugin using hooks:

```jsx
import { plugin } from 'webarcade';
import { createSignal, Show } from 'solid-js';
import {
    useReactiveService,
    useEvent,
    usePublish,
    useStore,
    useDebounce
} from 'webarcade';

function GameDashboard() {
    // Reactive service access
    const game = useReactiveService('game-engine');

    // Store access with reactivity
    const [playerName, setPlayerName] = useStore('player.name', 'Player 1');
    const [score, setScore] = useStore('player.score', 0);

    // Event handling with auto-cleanup
    useEvent('enemy:killed', (data) => {
        setScore(score() + data.points);
    });

    // Publish events
    const publishPause = usePublish('game:paused');

    // Debounced save
    const saveGame = useDebounce(() => {
        console.log('Saving game...');
        game.save();
    }, 1000);

    return (
        <div class="p-4 space-y-4">
            <div class="text-xl font-bold">
                Welcome, {playerName()}!
            </div>

            <div class="stats">
                <div class="stat">
                    <div class="stat-title">Score</div>
                    <div class="stat-value">{score()}</div>
                </div>
                <div class="stat">
                    <div class="stat-title">Meshes</div>
                    <div class="stat-value">{game.meshes().length}</div>
                </div>
            </div>

            <div class="flex gap-2">
                <button class="btn btn-primary" onClick={() => game.start()}>
                    Start
                </button>
                <button class="btn" onClick={() => publishPause({})}>
                    Pause
                </button>
                <button class="btn btn-secondary" onClick={saveGame}>
                    Save
                </button>
            </div>

            <Show when={game.selectedObject()}>
                <div class="alert">
                    Selected: {game.selectedObject().name}
                </div>
            </Show>
        </div>
    );
}

export default plugin({
    id: 'game-dashboard',
    name: 'Game Dashboard',
    version: '1.0.0',

    start(api) {
        api.register('dashboard', {
            type: 'panel',
            component: GameDashboard,
            label: 'Dashboard'
        });
    }
});
```

---

## Hooks vs Direct API

| Pattern | Hooks (Recommended) | Direct API |
|---------|---------------------|------------|
| Service access | `useReactiveService('audio')` | `await api.use('audio')` |
| Events | `useEvent('file:saved', fn)` | `api.subscribe('file:saved', fn)` + cleanup |
| Store | `const [val, set] = useStore('path')` | `api.get('path')` + `api.watch()` |
| Cleanup | Automatic | Manual in `stop()` |
| Reactivity | Built-in | Requires `api.selector()` |

**Why use hooks?**

1. **Automatic cleanup** - No need to track subscriptions for `stop()`
2. **Built-in reactivity** - Works seamlessly with SolidJS
3. **Less boilerplate** - Cleaner, more readable code
4. **Consistent patterns** - Same API across all features
5. **Component-scoped** - State and effects tied to component lifecycle

---

## Accessing Hooks

Hooks are available from the plugin API:

```jsx
import {
    useService,
    useOptionalService,
    useServiceReady,
    useReactiveService,
    useEvent,
    usePublish,
    useStore,
    useStoreSelector,
    useDebounce,
    useThrottle,
} from 'webarcade';
```

Or from the global `WebArcadeAPI`:

```jsx
const {
    useService,
    useReactiveService,
    useEvent,
    useStore,
} = window.WebArcadeAPI;
```
