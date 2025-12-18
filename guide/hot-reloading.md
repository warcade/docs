# Hot Reloading

WebArcade includes a built-in hot reloading system for rapid development. When you modify your code, the browser automatically refreshes to show your changes.

## How It Works

The development server uses a three-part architecture:

```
┌─────────────────┐     WebSocket      ┌─────────────────┐
│  Dev Server     │ ◄─────────────────► │  Browser        │
│  (port 3002)    │   "reload" message  │                 │
└─────────────────┘                     └─────────────────┘
        │
        │ Chokidar
        │ (file watcher)
        ▼
┌─────────────────┐
│  Source Files   │
│  src/ & plugins/│
└─────────────────┘
```

When you save a file:

1. **Chokidar** detects the file change
2. **esbuild** rebuilds the affected code
3. **WebSocket** sends a reload message to the browser
4. **Browser** refreshes automatically

## Starting Development Mode

Run the development server with:

```bash
npm run dev
```

This starts three servers:

| Server | Port | Purpose |
|--------|------|---------|
| App Server | 3000 | Serves the frontend |
| Bridge API | 3001 | Backend communication |
| Live Reload | 3002 | WebSocket for hot reload |

## What Gets Watched

The dev server watches three directories with different behaviors:

### Frontend Source (`src/`)

Changes to the core frontend trigger a full rebuild:

- All `.jsx`, `.js`, and `.css` files
- Rebuilds using esbuild with Babel for JSX transformation
- Processes Tailwind CSS via PostCSS

### Plugin Source (`plugins/`)

Each plugin is rebuilt individually:

- Watches `.jsx`, `.js`, and `.css` files up to 2 levels deep
- Only rebuilds the changed plugin
- Runs `webarcade build <plugin-id>` for that specific plugin

### Built Plugins (`app/plugins/`)

Watches for newly built plugins:

- Detects new or updated `.js` and `.dll` files
- Triggers a plugin rescan via the API
- No full page reload needed for plugin changes

::: tip
Plugin changes are more efficient than core changes. If you're only editing plugin code, only that plugin gets rebuilt.
:::

## Batch Building

To prevent excessive rebuilds during rapid edits, changes are batched:

```
┌──────────┐   ┌──────────┐   ┌──────────┐
│ Change 1 │   │ Change 2 │   │ Change 3 │
└────┬─────┘   └────┬─────┘   └────┬─────┘
     │              │              │
     └──────────────┴──────────────┘
                    │
                    ▼ (400ms delay)
              ┌───────────┐
              │ One Build │
              └───────────┘
```

- All changes within 400ms are collected together
- A single build runs after the batch window closes
- If you keep editing, the timer resets

This means if you're typing continuously, you won't get a rebuild until you pause.

## Cache Busting

To ensure browsers always load fresh assets, the dev server adds cache-busting query parameters:

```html
<link href="/assets/styles.css?v=1702000000000" rel="stylesheet">
<script src="/assets/app.js?v=1702000000000"></script>
```

The timestamp (`?v=...`) changes on every build, forcing the browser to download the new version.

## Build Output

When the dev server rebuilds, you'll see output like:

```
[dev] Frontend built in 245ms
      app.js: 156.2 KB
      index.html: 2.1 KB
```

This shows:
- Build time (should be fast, typically under 500ms)
- Output file sizes

## Troubleshooting

### Changes Not Appearing

If your changes aren't showing up:

1. **Check the terminal** - Look for build errors
2. **Hard refresh** - Try `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
3. **Clear cache** - Open DevTools > Application > Clear storage
4. **Restart dev server** - Sometimes a fresh start helps

### WebSocket Disconnected

If the hot reload stops working:

```
[dev] WebSocket connection lost, attempting reconnect...
```

The client will automatically attempt to reconnect. If it fails, the page will reload after 1 second.

### Build Takes Too Long

If builds are slow:

- Check for large dependencies being bundled
- Look for circular imports
- Consider code splitting for large plugins

::: warning
The dev server doesn't minify code for faster builds. Production builds (`npm run build:prod`) will be smaller.
:::

## How Live Reload is Injected

During development, a small script is automatically injected before `</body>`:

```javascript
(function() {
  const ws = new WebSocket('ws://localhost:3002');
  ws.onmessage = () => location.reload();
  ws.onclose = () => setTimeout(() => location.reload(), 1000);
})();
```

This script is **not** included in production builds.

## Development vs Production

| Feature | Development | Production |
|---------|-------------|------------|
| Live reload | Yes | No |
| Minification | No | Yes |
| Source maps | No | No |
| Console/debugger | Kept | Removed |
| Cache busting | Query params | Hashed filenames |
| Build time | ~200-500ms | ~2-5s |

## Next Steps

- **[Project Structure](/guide/project-structure)** - Understand what files to edit
- **[Creating Plugins](/plugins/creating-plugins)** - Build your first plugin
- **[CLI Commands](/cli/)** - All available commands
