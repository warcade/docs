# Creating Plugins

This guide walks you through creating your first WebArcade plugin.

## Create a New Plugin

```bash
# Frontend-only plugin
webarcade new my-plugin --frontend-only

# Full-stack plugin (with Rust backend)
webarcade new my-plugin

# With additional options
webarcade new my-plugin --name "My Plugin" --author "Your Name"
```

## Plugin Entry Point

Every plugin needs an `index.jsx` file:

```jsx
import { plugin } from '@/api/plugin';

export default plugin({
    id: 'my-plugin',
    name: 'My Plugin',
    version: '1.0.0',

    start(api) {
        // Called once when plugin loads
        // Register all UI components here
    },

    active(api) {
        // Called when user switches to this plugin
    },

    inactive(api) {
        // Called when user switches away
    },

    stop(api) {
        // Called when plugin is unloaded
    }
});
```

## Registering UI Components

Use `api.add()` to register components:

```jsx
start(api) {
    // Register plugin tab (appears in main tab bar)
    api.add({
        panel: 'tab',
        label: 'My Plugin',
        icon: MyIcon,
    });

    // Register main viewport content
    api.add({
        panel: 'viewport',
        id: 'main',
        component: MainView,
    });

    // Register left sidebar
    api.add({
        panel: 'left',
        id: 'explorer',
        label: 'Explorer',
        component: Explorer,
    });

    // Register right sidebar
    api.add({
        panel: 'right',
        id: 'properties',
        label: 'Properties',
        component: Properties,
    });

    // Register bottom panel
    api.add({
        panel: 'bottom',
        id: 'console',
        label: 'Console',
        component: Console,
    });
}
```

## Component Files

Organize your components in separate files:

```
plugins/my-plugin/
├── index.jsx           # Entry point
├── viewport.jsx        # Main view
├── sidebar.jsx         # Sidebar component
└── console.jsx         # Console component
```

Import and use them:

```jsx
import MainView from './viewport';
import Explorer from './sidebar';
import Console from './console';

export default plugin({
    id: 'my-plugin',
    name: 'My Plugin',
    version: '1.0.0',

    start(api) {
        api.add({ panel: 'viewport', id: 'main', component: MainView });
        api.add({ panel: 'left', id: 'explorer', label: 'Explorer', component: Explorer });
        api.add({ panel: 'bottom', id: 'console', label: 'Console', component: Console });
    }
});
```

## Using SolidJS

Components use SolidJS reactive primitives:

```jsx
// viewport.jsx
import { createSignal, createEffect } from 'solid-js';

export default function MainView() {
    const [count, setCount] = createSignal(0);

    createEffect(() => {
        console.log('Count changed:', count());
    });

    return (
        <div class="p-4">
            <h1 class="text-xl font-bold">Counter: {count()}</h1>
            <button
                class="btn btn-primary mt-4"
                onClick={() => setCount(c => c + 1)}
            >
                Increment
            </button>
        </div>
    );
}
```

## Built-in Styling

WebArcade comes with **Tailwind CSS**, **DaisyUI**, and **Tabler Icons** pre-configured. No setup required - just use them directly in your components.

### Tailwind CSS

All Tailwind utility classes are available out of the box:

```jsx
export default function MyComponent() {
    return (
        <div class="p-4 flex flex-col gap-4">
            <h1 class="text-2xl font-bold text-primary">Title</h1>
            <p class="text-gray-600 dark:text-gray-400">Description text</p>
            <div class="grid grid-cols-2 gap-2">
                <div class="bg-base-200 rounded-lg p-4">Card 1</div>
                <div class="bg-base-200 rounded-lg p-4">Card 2</div>
            </div>
        </div>
    );
}
```

### DaisyUI Components

DaisyUI provides pre-styled components that work with your theme:

```jsx
export default function MyComponent() {
    return (
        <div class="p-4 space-y-4">
            {/* Buttons */}
            <button class="btn btn-primary">Primary</button>
            <button class="btn btn-secondary">Secondary</button>
            <button class="btn btn-outline">Outline</button>

            {/* Inputs */}
            <input class="input input-bordered w-full" placeholder="Text input" />
            <textarea class="textarea textarea-bordered w-full" placeholder="Textarea" />
            <select class="select select-bordered w-full">
                <option>Option 1</option>
                <option>Option 2</option>
            </select>

            {/* Cards */}
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title">Card Title</h2>
                    <p>Card content goes here</p>
                    <div class="card-actions justify-end">
                        <button class="btn btn-primary">Action</button>
                    </div>
                </div>
            </div>

            {/* Alerts */}
            <div class="alert alert-info">Info message</div>
            <div class="alert alert-success">Success message</div>
            <div class="alert alert-warning">Warning message</div>
            <div class="alert alert-error">Error message</div>

            {/* Loading states */}
            <span class="loading loading-spinner loading-md"></span>
            <progress class="progress progress-primary w-56" value="70" max="100"></progress>
        </div>
    );
}
```

### Tabler Icons

Use [Tabler Icons](https://tabler.io/icons) directly - over 4,000 icons available:

```jsx
import { IconHome, IconSettings, IconUser, IconSearch } from '@tabler/icons-solidjs';

export default function MyComponent() {
    return (
        <div class="flex gap-4 p-4">
            <IconHome size={24} />
            <IconSettings size={24} class="text-primary" />
            <IconUser size={24} stroke={1.5} />
            <IconSearch size={20} class="text-gray-500" />
        </div>
    );
}
```

Common icon props:
- `size` - Icon size in pixels (default: 24)
- `stroke` - Stroke width (default: 2)
- `class` - CSS classes for styling

## Build and Test

```bash
# Build your plugin
webarcade build my-plugin

# Run the app
webarcade dev
```

## Adding npm Packages

Just import any npm package directly in your plugin - the builder automatically resolves, installs, and tree-shakes dependencies into your plugin bundle.

### Use Any Package

```jsx
import { debounce } from 'lodash';
import { format } from 'date-fns';
import { createQuery } from '@tanstack/solid-query';

export default function MyComponent() {
    const handleSearch = debounce((query) => {
        console.log('Searching:', query);
    }, 300);

    return (
        <div class="p-4">
            <p>Today: {format(new Date(), 'MMMM do, yyyy')}</p>
            <input
                class="input input-bordered"
                onInput={(e) => handleSearch(e.target.value)}
                placeholder="Search..."
            />
        </div>
    );
}
```

::: tip
No `npm install` needed. The plugin builder automatically detects imports, fetches packages, and tree-shakes only the code you use into the final bundle.
:::

## Adding Rust Crates

Full-stack plugins can use external Rust crates from crates.io.

### Add Dependencies

Add crates to your plugin's `Cargo.toml`:

```toml
[package]
name = "my-plugin"
version = "1.0.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
tokio = { version = "1.0", features = ["fs", "process"] }
reqwest = { version = "0.11", features = ["json"] }
chrono = "0.4"
uuid = { version = "1.0", features = ["v4"] }
regex = "1.0"

[routes]
"GET /data" = "handle_get_data"
```

::: info
Core dependencies like `serde`, `serde_json`, and `webarcade-api` are automatically injected by the plugin builder. Only add additional crates you need.
:::

### Use in Handlers

```rust
use api::{HttpRequest, HttpResponse, json_response};
use chrono::Utc;
use uuid::Uuid;
use regex::Regex;

pub async fn handle_get_data(_req: HttpRequest) -> HttpResponse {
    let id = Uuid::new_v4();
    let timestamp = Utc::now().to_rfc3339();

    json_response(&json!({
        "id": id.to_string(),
        "timestamp": timestamp,
        "message": "Hello from Rust!"
    }))
}

pub async fn handle_validate(req: HttpRequest) -> HttpResponse {
    let email_regex = Regex::new(r"^[\w\.-]+@[\w\.-]+\.\w+$").unwrap();
    let input: ValidateRequest = req.body_json().unwrap();

    let is_valid = email_regex.is_match(&input.email);

    json_response(&json!({
        "valid": is_valid
    }))
}
```

### Async Operations

Use `tokio` for async file system and process operations:

```rust
use tokio::fs;
use tokio::process::Command;

pub async fn handle_read_file(req: HttpRequest) -> HttpResponse {
    let path = req.query("path").unwrap_or_default();

    match fs::read_to_string(&path).await {
        Ok(content) => json_response(&json!({ "content": content })),
        Err(e) => error_response(500, &e.to_string())
    }
}

pub async fn handle_run_command(_req: HttpRequest) -> HttpResponse {
    let output = Command::new("git")
        .args(["status", "--short"])
        .output()
        .await
        .expect("Failed to run command");

    let stdout = String::from_utf8_lossy(&output.stdout);
    json_response(&json!({ "output": stdout }))
}
```

## Adding a Rust Backend

Full-stack plugins can include a Rust backend for performance-critical operations, file system access, or native integrations.

### Create a Full-Stack Plugin

```bash
# Creates plugin with both frontend and Rust backend
webarcade new my-plugin
```

This generates the following structure:

```
plugins/my-plugin/
├── index.jsx       # Frontend entry
├── Cargo.toml      # Routes definition
├── mod.rs          # Plugin metadata
└── router.rs       # HTTP handlers
```

### Define Routes

Add routes to your `Cargo.toml`:

```toml
[package]
name = "my-plugin"
version = "1.0.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[routes]
"GET /data" = "handle_get_data"
"POST /data" = "handle_save_data"
"GET /data/:id" = "handle_get_item"
```

::: tip
The plugin builder automatically injects all required dependencies. You don't need to manually add `webarcade-api` or `serde`.
:::

### Implement Handlers

Create your route handlers in `router.rs`:

```rust
use api::{HttpRequest, HttpResponse, json, json_response, error_response};
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
struct DataItem {
    id: u32,
    name: String,
    value: i32,
}

pub async fn handle_get_data(_req: HttpRequest) -> HttpResponse {
    let items = vec![
        DataItem { id: 1, name: "Item 1".into(), value: 100 },
        DataItem { id: 2, name: "Item 2".into(), value: 200 },
    ];
    json_response(&items)
}

pub async fn handle_get_item(req: HttpRequest) -> HttpResponse {
    let id = req.path_params.get("id")
        .and_then(|s| s.parse::<u32>().ok())
        .unwrap_or(0);

    if id == 0 {
        return error_response(400, "Invalid ID");
    }

    json_response(&DataItem {
        id,
        name: format!("Item {}", id),
        value: id as i32 * 100,
    })
}

#[derive(Deserialize)]
struct SaveRequest {
    name: String,
    value: i32,
}

pub async fn handle_save_data(req: HttpRequest) -> HttpResponse {
    let input: SaveRequest = match req.body_json() {
        Ok(data) => data,
        Err(_) => return error_response(400, "Invalid JSON"),
    };

    json_response(&json!({
        "success": true,
        "saved": { "name": input.name, "value": input.value }
    }))
}
```

### Define Plugin Metadata

Update `mod.rs` with your plugin info:

```rust
use api::{Plugin, PluginMetadata};

pub struct MyPlugin;

impl Plugin for MyPlugin {
    fn metadata(&self) -> PluginMetadata {
        PluginMetadata {
            id: "my-plugin".into(),
            name: "My Plugin".into(),
            version: "1.0.0".into(),
            description: "A full-stack WebArcade plugin".into(),
            author: "Your Name".into(),
            dependencies: vec![],
        }
    }
}
```

### Call Backend from Frontend

Use the HTTP API to call your Rust handlers:

```jsx
import { http } from '@/api/http';

export default function DataView() {
    const [data, setData] = createSignal([]);
    const [loading, setLoading] = createSignal(true);

    onMount(async () => {
        const result = await http.get('/plugins/my-plugin/data');
        setData(result);
        setLoading(false);
    });

    const saveItem = async (name, value) => {
        const result = await http.post('/plugins/my-plugin/data', {
            name,
            value
        });
        console.log('Saved:', result);
    };

    return (
        <div class="p-4">
            {loading() ? (
                <span class="loading loading-spinner"></span>
            ) : (
                <ul>
                    {data().map(item => (
                        <li>{item.name}: {item.value}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}
```

### Build Full-Stack Plugin

```bash
# Builds both frontend JS and Rust DLL
webarcade build my-plugin

# Output:
# build/plugins/my-plugin.js
# build/plugins/my-plugin.dll
```

## Next Steps

- [Plugin Lifecycle](/plugins/plugin-lifecycle) - Understanding lifecycle hooks
- [Panel System](/plugins/panels) - Deep dive into panels
- [Plugin API](/api/plugin-api) - Full frontend API reference
- [Rust API](/api/rust-api) - Complete Rust backend API reference
