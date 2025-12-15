# Full-Stack Plugin

A complete plugin with SolidJS frontend and Rust backend.

## Create the Plugin

```bash
webarcade new todo-app
```

## Plugin Structure

```
plugins/todo-app/
├── index.jsx       # Frontend entry
├── Cargo.toml      # Routes & dependencies
├── mod.rs          # Plugin metadata
└── router.rs       # HTTP handlers
```

## Frontend: index.jsx

```jsx
import { plugin, api } from '@/api/plugin';
import { createSignal, createResource, For, Show } from 'solid-js';
import { IconPlus, IconTrash, IconCheck, IconList, IconRefresh } from '@tabler/icons-solidjs';

// Fetch todos from backend
async function fetchTodos() {
    const res = await api('todo-app/todos');
    return res.json();
}

// Main todo list component
function TodoList() {
    const [todos, { refetch }] = createResource(fetchTodos);
    const [newTodo, setNewTodo] = createSignal('');

    const addTodo = async () => {
        if (!newTodo().trim()) return;

        await api('todo-app/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: newTodo() })
        });

        setNewTodo('');
        refetch();
    };

    const toggleTodo = async (id) => {
        await api(`todo-app/todos/${id}/toggle`, { method: 'PUT' });
        refetch();
    };

    const deleteTodo = async (id) => {
        await api(`todo-app/todos/${id}`, { method: 'DELETE' });
        refetch();
    };

    return (
        <div class="p-6 max-w-xl mx-auto">
            <h1 class="text-2xl font-bold mb-6">Todo List</h1>

            {/* Add todo form */}
            <div class="flex gap-2 mb-6">
                <input
                    type="text"
                    class="input input-bordered flex-1"
                    placeholder="What needs to be done?"
                    value={newTodo()}
                    onInput={(e) => setNewTodo(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                />
                <button class="btn btn-primary" onClick={addTodo}>
                    <IconPlus size={20} />
                    Add
                </button>
            </div>

            {/* Todo list */}
            <div class="space-y-2">
                <Show when={todos()} fallback={<div>Loading...</div>}>
                    <For each={todos()}>
                        {(todo) => (
                            <div class="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                                <button
                                    class={`btn btn-circle btn-sm ${todo.completed ? 'btn-success' : 'btn-ghost'}`}
                                    onClick={() => toggleTodo(todo.id)}
                                >
                                    <IconCheck size={16} />
                                </button>
                                <span class={`flex-1 ${todo.completed ? 'line-through opacity-50' : ''}`}>
                                    {todo.text}
                                </span>
                                <button
                                    class="btn btn-circle btn-sm btn-ghost text-error"
                                    onClick={() => deleteTodo(todo.id)}
                                >
                                    <IconTrash size={16} />
                                </button>
                            </div>
                        )}
                    </For>
                </Show>
            </div>
        </div>
    );
}

// Stats sidebar
function Stats() {
    const [todos] = createResource(fetchTodos);

    const total = () => todos()?.length || 0;
    const completed = () => todos()?.filter(t => t.completed).length || 0;
    const pending = () => total() - completed();

    return (
        <div class="p-4">
            <h2 class="font-bold mb-4">Statistics</h2>
            <div class="stats stats-vertical shadow">
                <div class="stat">
                    <div class="stat-title">Total</div>
                    <div class="stat-value">{total()}</div>
                </div>
                <div class="stat">
                    <div class="stat-title">Completed</div>
                    <div class="stat-value text-success">{completed()}</div>
                </div>
                <div class="stat">
                    <div class="stat-title">Pending</div>
                    <div class="stat-value text-warning">{pending()}</div>
                </div>
            </div>
        </div>
    );
}

// Plugin definition
export default plugin({
    id: 'todo-app',
    name: 'Todo App',
    version: '1.0.0',

    start(api) {
        // Main viewport panel
        api.register('todo-list', {
            type: 'panel',
            component: TodoList,
            label: 'Tasks',
            icon: IconList
        });

        // Stats sidebar panel
        api.register('stats', {
            type: 'panel',
            component: Stats,
            label: 'Stats'
        });

        // Toolbar button
        api.register('refresh', {
            type: 'toolbar',
            icon: IconRefresh,
            tooltip: 'Refresh todos',
            onClick: () => window.location.reload()
        });

        // Keyboard shortcut
        api.shortcut({
            'ctrl+r': () => window.location.reload()
        });
    }
});
```

## Backend: Cargo.toml

```toml
[package]
name = "todo-app"
version = "1.0.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
webarcade-api = { version = "0.1", features = ["bridge"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
lazy_static = "1.4"

[routes]
"GET /todos" = "handle_list"
"POST /todos" = "handle_create"
"PUT /todos/:id/toggle" = "handle_toggle"
"DELETE /todos/:id" = "handle_delete"
```

## Backend: mod.rs

```rust
use api::{Plugin, PluginMetadata};

pub struct TodoPlugin;

impl Plugin for TodoPlugin {
    fn metadata(&self) -> PluginMetadata {
        PluginMetadata {
            id: "todo-app".into(),
            name: "Todo App".into(),
            version: "1.0.0".into(),
            description: "A simple todo list".into(),
            author: "WebArcade".into(),
            dependencies: vec![],
        }
    }
}
```

## Backend: router.rs

```rust
use api::{HttpRequest, HttpResponse, json, json_response, error_response};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;

lazy_static::lazy_static! {
    static ref TODOS: Mutex<Vec<Todo>> = Mutex::new(vec![
        Todo { id: 1, text: "Learn WebArcade".into(), completed: false },
        Todo { id: 2, text: "Build a plugin".into(), completed: false },
    ]);
    static ref NEXT_ID: Mutex<u32> = Mutex::new(3);
}

#[derive(Clone, Serialize, Deserialize)]
struct Todo {
    id: u32,
    text: String,
    completed: bool,
}

#[derive(Deserialize)]
struct CreateTodo {
    text: String,
}

pub async fn handle_list(_req: HttpRequest) -> HttpResponse {
    let todos = TODOS.lock().unwrap();
    json_response(&*todos)
}

pub async fn handle_create(req: HttpRequest) -> HttpResponse {
    let input: CreateTodo = match req.body_json() {
        Ok(data) => data,
        Err(_) => return error_response(400, "Invalid JSON"),
    };

    if input.text.trim().is_empty() {
        return error_response(400, "Text cannot be empty");
    }

    let mut todos = TODOS.lock().unwrap();
    let mut next_id = NEXT_ID.lock().unwrap();

    let todo = Todo {
        id: *next_id,
        text: input.text.trim().to_string(),
        completed: false,
    };
    *next_id += 1;

    todos.push(todo.clone());
    json_response(&todo)
}

pub async fn handle_toggle(req: HttpRequest) -> HttpResponse {
    let id: u32 = match req.path_params.get("id").and_then(|s| s.parse().ok()) {
        Some(id) => id,
        None => return error_response(400, "Invalid ID"),
    };

    let mut todos = TODOS.lock().unwrap();

    if let Some(todo) = todos.iter_mut().find(|t| t.id == id) {
        todo.completed = !todo.completed;
        json_response(todo)
    } else {
        error_response(404, "Todo not found")
    }
}

pub async fn handle_delete(req: HttpRequest) -> HttpResponse {
    let id: u32 = match req.path_params.get("id").and_then(|s| s.parse().ok()) {
        Some(id) => id,
        None => return error_response(400, "Invalid ID"),
    };

    let mut todos = TODOS.lock().unwrap();
    let len_before = todos.len();
    todos.retain(|t| t.id != id);

    if todos.len() < len_before {
        json_response(&json!({ "deleted": true }))
    } else {
        error_response(404, "Todo not found")
    }
}
```

## Build and Run

```bash
# Build the plugin (compiles Rust + bundles JS)
webarcade build todo-app

# Run the application
webarcade dev
```

## What This Example Demonstrates

### Frontend-Backend Communication

```jsx
// GET request
const res = await api('todo-app/todos');
const todos = await res.json();

// POST request
await api('todo-app/todos', {
    method: 'POST',
    body: JSON.stringify({ text: 'New todo' })
});
```

### Rust HTTP Handlers

```rust
pub async fn handle_create(req: HttpRequest) -> HttpResponse {
    let input: CreateTodo = req.body_json()?;
    // ... create todo
    json_response(&todo)
}
```

### Path Parameters

```toml
# Cargo.toml
"PUT /todos/:id/toggle" = "handle_toggle"
```

```rust
// router.rs
let id = req.path_params.get("id");
```

### SolidJS Resources

```jsx
const [todos, { refetch }] = createResource(fetchTodos);
// Automatic loading state
// refetch() to reload data
```

### Component Registration

```jsx
api.register('todo-list', {
    type: 'panel',
    component: TodoList,
    label: 'Tasks',
    icon: IconList
});
```

## Adding Contracts

Make components discoverable by other plugins:

```jsx
api.register('todo-list', {
    type: 'panel',
    component: TodoList,
    label: 'Tasks',
    contracts: {
        provides: ['task-list', 'todo-manager'],
        emits: ['todo-created', 'todo-completed', 'todo-deleted']
    }
});
```

## Architecture

```
┌──────────────────┐         ┌──────────────────┐
│   SolidJS UI     │  HTTP   │   Rust Backend   │
│                  │ ──────▶ │                  │
│  TodoList.jsx    │         │   router.rs      │
│                  │ ◀────── │                  │
│  (port 3000)     │         │   (port 3001)    │
└──────────────────┘         └──────────────────┘
```

## Next Steps

- Add [keyboard shortcuts](/api/index#keyboard-shortcuts) for common actions
- Implement [contracts](/api/registry) for cross-plugin communication
- Add [context menus](/api/index#context-menus) for right-click actions
- Create a [custom layout](/api/layout-manager) for the todo app
