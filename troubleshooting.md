# Troubleshooting Guide

This comprehensive guide helps you diagnose and resolve common issues with WebArcade.

## Installation Issues

### "cargo: command not found"

**Cause:** Rust is not installed or not in your PATH.

**Solution:**
1. Install Rust from [rustup.rs](https://rustup.rs/)
2. Restart your terminal
3. Verify: `cargo --version`

### "bun: command not found"

**Cause:** Bun is not installed or not in your PATH.

**Solution:**
1. Install Bun from [bun.sh](https://bun.sh/)
2. Restart your terminal
3. Verify: `bun --version`

### "webarcade: command not found"

**Cause:** WebArcade CLI is not installed or not in PATH.

**Solution:**
```bash
# Install the CLI
cargo install webarcade

# Verify installation
webarcade --version

# If still not found, add cargo bin to PATH
export PATH="$HOME/.cargo/bin:$PATH"
```

### Installation Fails with Permission Errors

**On macOS/Linux:**
```bash
# Don't use sudo with cargo
# Instead, ensure ~/.cargo/bin is writable
chmod -R u+w ~/.cargo

# Then install
cargo install webarcade
```

**On Windows:**
- Run terminal as Administrator
- Or install to a user-writable directory

---

## Build Issues

### "Plugin not detected"

**Cause:** Missing or misconfigured plugin entry point.

**Solution:**
1. Ensure `plugins/plugin-name/index.jsx` exists
2. Check that the file exports a default plugin:
```jsx
import { plugin } from 'webarcade';

export default plugin({
    id: 'plugin-name',
    name: 'Plugin Name',
    version: '1.0.0',
    start(api) {
        // ...
    }
});
```

### "Handler not found"

**Cause:** Route handler name in Cargo.toml doesn't match the function name.

**Solution:**
```toml
# Cargo.toml - route name must match function exactly
[routes]
"GET /hello" = "handle_hello"  # This name...
```

```rust
// router.rs - ...must match this name
pub async fn handle_hello(req: HttpRequest) -> HttpResponse {
    // ...
}
```

### "Build failed" - Handler Signature

**Cause:** Incorrect handler function signature.

**Solution:** Use the exact signature:
```rust
pub async fn handler_name(req: HttpRequest) -> HttpResponse {
    // Must be:
    // - pub (public)
    // - async
    // - Takes HttpRequest
    // - Returns HttpResponse
}
```

### Rust Compilation Errors

**"cannot find type `HttpRequest`":**
```rust
// Add this import at the top of router.rs
use api::{HttpRequest, HttpResponse, json_response, error_response};
```

**"unresolved import `serde`":**
```rust
// Add this import
use serde::{Deserialize, Serialize};
```

### Slow Build Times

**First build is slow:** This is normal. Rust compiles all dependencies on first build.

**Subsequent builds are slow:**
1. Use incremental builds: `webarcade build plugin-name` instead of `webarcade build --all`
2. Check disk space
3. Ensure antivirus isn't scanning the target directory

---

## Runtime Issues

### "DLL won't reload"

**Cause:** DLL files are locked while the application is running.

**Solution:**
1. Stop the application (Ctrl+C)
2. Rebuild the plugin: `webarcade build my-plugin`
3. Restart: `webarcade dev`

### Application Won't Start

**Check the console for errors:**
```bash
RUST_LOG=debug webarcade dev
```

**Common causes:**
- Port already in use (another instance running)
- Missing plugin files
- Corrupted build

**Solution:**
```bash
# Kill any existing processes
# Windows:
taskkill /f /im my-app.exe

# macOS/Linux:
pkill -f webarcade

# Clean and rebuild
rm -rf build/
rm -rf app/target/
webarcade build --all
webarcade dev
```

### White Screen / Blank Window

**Cause:** Frontend build failed or JavaScript errors.

**Solution:**
1. Open developer tools (if available): Ctrl+Shift+I
2. Check the Console tab for errors
3. Rebuild the frontend:
```bash
rm -rf build/
webarcade build --all
```

### Plugin Not Appearing

**Checklist:**
1. Is the plugin built? Check `build/plugins/plugin-name.js` exists
2. Is it enabled? Check settings
3. Does it register a panel? Check `api.register()` in start()
4. Check console for errors

---

## API Issues

### HTTP Requests Failing

**CORS errors:**
- WebArcade handles CORS automatically
- If using external APIs, they must allow your origin

**Connection refused:**
```bash
# Check if the backend is running
curl http://localhost:3001/my-plugin/hello

# If not, check logs
RUST_LOG=debug webarcade dev
```

### "Service not found" / "Timeout waiting for service"

**Cause:** The plugin providing the service isn't loaded or hasn't registered it yet.

**Solution:**
```jsx
// Add a timeout and fallback
try {
    const service = await api.use('my-service', 10000); // 10 second timeout
} catch (error) {
    console.warn('Service not available, using fallback');
    // Handle missing service
}

// Or check if service exists first
if (api.hasService('my-service')) {
    const service = await api.use('my-service');
}
```

### Shared Store Not Updating

**Cause:** Using direct assignment instead of api.set()

**Wrong:**
```jsx
const data = api.get('myData');
data.value = 'new'; // This won't trigger updates!
```

**Correct:**
```jsx
api.set('myData.value', 'new'); // This triggers updates

// Or for complex updates
api.update('myData', (current) => ({
    ...current,
    value: 'new'
}));
```

---

## Performance Issues

### High Memory Usage

**Diagnosis:**
1. Open Task Manager / Activity Monitor
2. Check memory usage over time

**Solutions:**
- Clean up event listeners in `stop()`:
```jsx
stop(api) {
    this.unsubscribe?.();
    this.cleanup?.();
}
```
- Avoid storing large data in the shared store
- Use pagination for large lists

### Slow UI / Laggy Scrolling

**Solutions:**
1. Use virtualization for long lists:
```jsx
import { VirtualList } from '@solid-primitives/virtual';

<VirtualList items={items} itemHeight={40}>
    {(item) => <ItemRow item={item} />}
</VirtualList>
```

2. Memoize expensive computations:
```jsx
import { createMemo } from 'solid-js';

const filteredItems = createMemo(() =>
    items().filter(item => item.name.includes(search()))
);
```

3. Debounce frequent updates:
```jsx
import { debounce } from '@solid-primitives/scheduled';

const debouncedSearch = debounce((value) => {
    setSearchTerm(value);
}, 300);
```

### Plugin Taking Too Long to Load

**Solutions:**
1. Lazy load heavy components:
```jsx
import { lazy } from 'solid-js';

const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

2. Defer non-essential initialization:
```jsx
start(api) {
    // Register UI immediately
    api.register('main-view', {
        type: 'panel',
        component: MainView,
        label: 'My Plugin'
    });

    // Defer heavy initialization
    setTimeout(() => {
        this.loadData();
        this.initializeFeatures();
    }, 100);
}
```

---

## Platform-Specific Issues

### Windows

**"VCRUNTIME140.dll not found":**
- Install [Visual C++ Redistributable](https://aka.ms/vs/17/release/vc_redist.x64.exe)

**Antivirus blocking:**
- Add your project folder to antivirus exclusions
- Add `app/target/` to exclusions

**Long path issues:**
- Enable long paths in Windows:
```powershell
# Run as Administrator
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

### macOS

**"App is damaged" message:**
```bash
# Remove quarantine attribute
xattr -cr /path/to/app.app
```

**Gatekeeper blocking:**
- Right-click > Open (first time)
- Or: System Preferences > Security > "Open Anyway"

**M1/M2 (Apple Silicon) issues:**
```bash
# Ensure using arm64 Rust
rustup default stable-aarch64-apple-darwin

# Rebuild
cargo clean
webarcade build --all
```

### Linux

**Missing libraries:**
```bash
# Ubuntu/Debian
sudo apt install libwebkit2gtk-4.0-dev libgtk-3-dev libappindicator3-dev

# Fedora
sudo dnf install webkit2gtk3-devel gtk3-devel libappindicator-gtk3-devel

# Arch
sudo pacman -S webkit2gtk gtk3 libappindicator-gtk3
```

**Display issues (Wayland):**
```bash
# Force X11
GDK_BACKEND=x11 webarcade dev
```

---

## Debugging Tips

### Enable Verbose Logging

```bash
# All debug logs
RUST_LOG=debug webarcade dev

# Specific module logs
RUST_LOG=my_plugin=debug webarcade dev

# Multiple levels
RUST_LOG=warn,my_plugin=debug,webarcade=info webarcade dev
```

### Developer Tools

In development mode, press `Ctrl+Shift+I` to open developer tools.

**Useful tabs:**
- **Console** - JavaScript errors and logs
- **Network** - API request failures
- **Elements** - DOM inspection
- **Performance** - Profiling

### Common Debug Patterns

```jsx
// Add debug logging to lifecycle
start(api) {
    console.log('[MyPlugin] Starting...');
    // ...
    console.log('[MyPlugin] Started successfully');
}

active(api) {
    console.log('[MyPlugin] Became active');
}

// Debug API calls
async function fetchData() {
    console.log('[MyPlugin] Fetching data...');
    try {
        const response = await api('my-plugin/data');
        console.log('[MyPlugin] Response status:', response.status);
        const data = await response.json();
        console.log('[MyPlugin] Data:', data);
        return data;
    } catch (error) {
        console.error('[MyPlugin] Fetch error:', error);
        throw error;
    }
}
```

---

## Getting Help

If you're still stuck:

1. **Search existing issues:** [GitHub Issues](https://github.com/warcade/core/issues)

2. **Check the documentation:** Make sure you've read the relevant docs

3. **Create a minimal reproduction:** Simplify your code to isolate the problem

4. **Open a new issue** with:
   - WebArcade version (`webarcade --version`)
   - Operating system and version
   - Steps to reproduce
   - Expected vs actual behavior
   - Error messages (full text)
   - Relevant code snippets

5. **Join the community:** [Discord](https://discord.gg/webarcade) for real-time help
