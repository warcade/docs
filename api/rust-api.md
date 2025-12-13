# Rust API

Build plugin backends with Rust for performance-critical operations.

::: tip
When you create a full-stack plugin with `webarcade new my-plugin`, the CLI automatically sets up your `Cargo.toml` with all necessary dependencies. No manual configuration required.
:::

## Plugin Structure

A full-stack plugin has these Rust files:

```
plugins/my-plugin/
├── index.jsx       # Frontend entry
├── Cargo.toml      # Routes & dependencies
├── mod.rs          # Plugin metadata
└── router.rs       # HTTP handlers
```

## Cargo.toml

Define routes in your `Cargo.toml`. The plugin builder automatically handles dependencies:

```toml
[package]
name = "my-plugin"
version = "1.0.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[routes]
"GET /hello" = "handle_hello"
"GET /users" = "handle_get_users"
"POST /users" = "handle_create_user"
"GET /users/:id" = "handle_get_user"
"PUT /users/:id" = "handle_update_user"
"DELETE /users/:id" = "handle_delete_user"
```

::: info
You don't need to add `webarcade-api`, `serde`, or `serde_json` as dependencies. The plugin builder injects these automatically during the build process.
:::

## mod.rs

Define plugin metadata:

```rust
use api::{Plugin, PluginMetadata};

pub struct MyPlugin;

impl Plugin for MyPlugin {
    fn metadata(&self) -> PluginMetadata {
        PluginMetadata {
            id: "my-plugin".into(),
            name: "My Plugin".into(),
            version: "1.0.0".into(),
            description: "A WebArcade plugin".into(),
            author: "Your Name".into(),
            dependencies: vec![],
        }
    }
}
```

## router.rs

Implement HTTP handlers:

```rust
use api::{HttpRequest, HttpResponse, json, json_response, error_response};
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
struct User {
    id: u32,
    name: String,
    email: String,
}

pub async fn handle_hello(_req: HttpRequest) -> HttpResponse {
    json_response(&json!({
        "message": "Hello from Rust!"
    }))
}

pub async fn handle_get_users(_req: HttpRequest) -> HttpResponse {
    let users = vec![
        User { id: 1, name: "Alice".into(), email: "alice@example.com".into() },
        User { id: 2, name: "Bob".into(), email: "bob@example.com".into() },
    ];
    json_response(&users)
}

pub async fn handle_get_user(req: HttpRequest) -> HttpResponse {
    let id = req.path_params.get("id")
        .and_then(|s| s.parse::<u32>().ok())
        .unwrap_or(0);

    if id == 0 {
        return error_response(400, "Invalid user ID");
    }

    json_response(&User {
        id,
        name: format!("User {}", id),
        email: format!("user{}@example.com", id),
    })
}
```

## HttpRequest

| Field/Method | Type | Description |
|--------------|------|-------------|
| `method` | `String` | HTTP method (GET, POST, etc.) |
| `path` | `String` | Request path |
| `query` | `HashMap<String, String>` | Query parameters |
| `path_params` | `HashMap<String, String>` | Path parameters |
| `headers` | `HashMap<String, String>` | Request headers |
| `body` | `Vec<u8>` | Raw request body |

### Methods

```rust
// Get query parameter
let search = req.query("search");  // Option<String>

// Get path parameter
let id = req.path_params.get("id");  // Option<&String>

// Get header
let auth = req.header("Authorization");  // Option<&String>

// Parse JSON body
#[derive(Deserialize)]
struct CreateUser {
    name: String,
    email: String,
}

let user: CreateUser = req.body_json()?;
```

## HttpResponse

### Response Helpers

```rust
use api::{json_response, error_response, HttpResponse};

// JSON response (200 OK)
json_response(&json!({ "status": "ok" }))

// Error response
error_response(404, "User not found")
error_response(400, "Invalid input")
error_response(500, "Internal server error")

// Custom response
HttpResponse {
    status: 201,
    headers: vec![
        ("Content-Type".into(), "application/json".into()),
        ("X-Custom-Header".into(), "value".into()),
    ],
    body: serde_json::to_vec(&data).unwrap(),
}
```

## Complete Example

```rust
// router.rs
use api::{HttpRequest, HttpResponse, json, json_response, error_response};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;

// In-memory storage (in production, use a database)
lazy_static::lazy_static! {
    static ref ITEMS: Mutex<Vec<Item>> = Mutex::new(vec![]);
    static ref NEXT_ID: Mutex<u32> = Mutex::new(1);
}

#[derive(Clone, Serialize, Deserialize)]
struct Item {
    id: u32,
    name: String,
    completed: bool,
}

#[derive(Deserialize)]
struct CreateItem {
    name: String,
}

pub async fn handle_list(_req: HttpRequest) -> HttpResponse {
    let items = ITEMS.lock().unwrap();
    json_response(&*items)
}

pub async fn handle_create(req: HttpRequest) -> HttpResponse {
    let input: CreateItem = match req.body_json() {
        Ok(data) => data,
        Err(_) => return error_response(400, "Invalid JSON"),
    };

    let mut items = ITEMS.lock().unwrap();
    let mut next_id = NEXT_ID.lock().unwrap();

    let item = Item {
        id: *next_id,
        name: input.name,
        completed: false,
    };
    *next_id += 1;

    items.push(item.clone());
    json_response(&item)
}

pub async fn handle_toggle(req: HttpRequest) -> HttpResponse {
    let id: u32 = match req.path_params.get("id").and_then(|s| s.parse().ok()) {
        Some(id) => id,
        None => return error_response(400, "Invalid ID"),
    };

    let mut items = ITEMS.lock().unwrap();

    if let Some(item) = items.iter_mut().find(|i| i.id == id) {
        item.completed = !item.completed;
        json_response(item)
    } else {
        error_response(404, "Item not found")
    }
}

pub async fn handle_delete(req: HttpRequest) -> HttpResponse {
    let id: u32 = match req.path_params.get("id").and_then(|s| s.parse().ok()) {
        Some(id) => id,
        None => return error_response(400, "Invalid ID"),
    };

    let mut items = ITEMS.lock().unwrap();
    let len_before = items.len();
    items.retain(|i| i.id != id);

    if items.len() < len_before {
        json_response(&json!({ "deleted": true }))
    } else {
        error_response(404, "Item not found")
    }
}
```

```toml
# Cargo.toml
[routes]
"GET /items" = "handle_list"
"POST /items" = "handle_create"
"PUT /items/:id/toggle" = "handle_toggle"
"DELETE /items/:id" = "handle_delete"
```

## Building

```bash
# Build the plugin (compiles Rust + bundles JS)
webarcade build my-plugin

# Output: build/plugins/my-plugin.dll + my-plugin.js
```

## Debugging

Set `RUST_LOG=debug` for detailed logging:

```bash
RUST_LOG=debug webarcade dev
```

Common issues:
- **"Handler not found"** - Check route names match function names in `Cargo.toml`
- **"Build failed"** - Ensure handler signature is `pub async fn name(req: HttpRequest) -> HttpResponse`
- **"DLL won't reload"** - Restart the app (DLLs are locked while loaded)
