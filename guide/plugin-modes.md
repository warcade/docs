# Plugin Modes

WebArcade supports two ways to package your application: **Unlocked** and **Locked** mode.

## What's the Difference?

| Feature | Unlocked Mode | Locked Mode |
|---------|---------------|-------------|
| Plugins location | Separate `plugins/` folder | Embedded in executable |
| Users can add plugins | ✅ Yes | ❌ No |
| Users can remove plugins | ✅ Yes | ❌ No |
| Distribution | Multiple files | Single file |
| Startup time | Slightly slower | Faster |
| File size | Larger total | Smaller total |

## Unlocked Mode (Default)

Build command:

```bash
webarcade app
```

### How It Works

In unlocked mode, your application looks like this:

```
MyApp/
├── MyApp.exe           # The runtime
└── plugins/            # Plugins folder
    ├── editor.js       # Plugin: Editor
    ├── editor.dll      # Plugin: Editor backend
    ├── preview.js      # Plugin: Preview
    └── themes.js       # Plugin: Themes
```

When the app starts:
1. The runtime starts
2. It scans the `plugins/` folder
3. It loads each `.js` file as a plugin
4. If a `.dll` with the same name exists, it loads that too

### Why Use Unlocked Mode?

**1. Users can add plugins**

Users can download new plugins and drop them in the `plugins/` folder:

```
plugins/
├── editor.js           # Came with the app
├── editor.dll
├── preview.js          # Came with the app
├── my-custom-theme.js  # ← User added this!
└── spell-checker.js    # ← User added this!
```

**2. Easier updates**

You can update individual plugins without releasing a new version of the entire app:

```bash
# Just replace the plugin file
copy new-editor.js plugins/editor.js
```

**3. Community plugins**

Other developers can create plugins for your app that users can install.

### When to Use Unlocked Mode

- IDE/editor applications
- Apps that benefit from extensibility
- Apps where users want to customize functionality
- When you plan to release plugins separately

## Locked Mode

Build command:

```bash
webarcade app --locked
```

### How It Works

In locked mode, your application is a single file:

```
MyApp/
└── MyApp.exe           # Everything is inside
```

All plugins are compressed and embedded inside the executable. When the app starts:
1. The runtime starts
2. It extracts plugins from inside itself (to memory)
3. It loads the plugins

### Why Use Locked Mode?

**1. Simpler distribution**

One file is easier to distribute than a folder:

- Easier to email
- Easier to download
- Easier to install
- No "missing files" problems

**2. Faster startup**

No filesystem scanning needed - plugins are loaded directly from memory.

**3. Tamper protection**

Users can't easily modify or remove plugins. Good for:

- Commercial software
- Apps where all features should always be available
- Apps where plugin modification would cause problems

**4. Smaller total size**

Plugins are compressed inside the executable, often resulting in a smaller total size.

### When to Use Locked Mode

- Simple applications with fixed features
- Commercial software
- Apps that don't need extensibility
- When you want easy single-file distribution

## Building Both Modes

You can test both modes during development:

```bash
# Test unlocked mode
webarcade app
# Creates: app/target/release/MyApp.exe + plugins/

# Test locked mode
webarcade app --locked
# Creates: app/target/release/MyApp.exe (all-in-one)
```

## Switching Modes

Both modes use the exact same plugin code. You don't need to change anything in your plugins:

```jsx
// This plugin works in both modes
export default plugin({
    id: 'my-plugin',
    name: 'My Plugin',
    version: '1.0.0',
    start(api) {
        // Same code works in both modes
    }
});
```

## Distribution Comparison

### Unlocked Mode Distribution

```
MyApp-1.0.0/
├── MyApp.exe           # 2.5 MB
└── plugins/
    ├── editor.js       # 50 KB
    ├── editor.dll      # 200 KB
    ├── preview.js      # 30 KB
    └── themes.js       # 20 KB
                        # ─────────
                        # Total: ~2.8 MB
```

### Locked Mode Distribution

```
MyApp-1.0.0/
└── MyApp.exe           # ~2.6 MB (compressed plugins)
```

## Hybrid Approach

Some applications use both:

1. **Core plugins** are embedded (locked)
2. **Optional plugins** are loaded from the folder (unlocked)

This is an advanced pattern not directly supported by the CLI, but you can implement it by:

1. Building in locked mode with core plugins
2. Also scanning a `plugins/` folder for additional plugins

## FAQ

### Can users break my app by deleting plugins in unlocked mode?

Yes, if they delete required plugins, the app may not work correctly. Consider:

- Using locked mode for critical features
- Handling missing plugins gracefully
- Re-downloading missing plugins on startup

### Can I ship updates to locked plugins?

Yes, but you need to release a new version of the entire application. The user downloads and installs the new version.

### Which mode should I start with?

**Start with unlocked mode** during development - it's easier to iterate. Switch to locked mode when you're ready to distribute if that makes sense for your app.

### Can I convert from unlocked to locked later?

Yes! Just run `webarcade app --locked` instead of `webarcade app`. No code changes required.
