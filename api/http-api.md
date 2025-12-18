# HTTP API

Communicate with plugin Rust backends via HTTP.

## Frontend Requests

### api()

Make HTTP requests to plugin backends. The `api` function is exported from the plugin module.

```jsx
import { api } from 'webarcade';

// Signature
api(endpoint: string, options?: RequestInit): Promise<Response>
```

### GET Request

```jsx
const response = await api('my-plugin/users');
const users = await response.json();
```

### POST Request

```jsx
const response = await api('my-plugin/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'John', email: 'john@example.com' })
});

const newUser = await response.json();
```

### PUT Request

```jsx
const response = await api('my-plugin/users/123', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'John Updated' })
});
```

### DELETE Request

```jsx
const response = await api('my-plugin/users/123', {
    method: 'DELETE'
});
```

## URL Format

Endpoints follow the pattern: `plugin-id/route`

```jsx
// Routes to: localhost:3001/my-plugin/hello
await api('my-plugin/hello');

// Routes to: localhost:3001/file-manager/files
await api('file-manager/files');

// With path parameters (defined in Cargo.toml)
await api('my-plugin/users/123');  // :id = 123
```

## Query Parameters

```jsx
// Manual query string
await api('my-plugin/search?q=hello&limit=10');

// Using URLSearchParams
const params = new URLSearchParams({ q: 'hello', limit: '10' });
await api(`my-plugin/search?${params}`);
```

## Error Handling

```jsx
try {
    const response = await api('my-plugin/data');

    if (!response.ok) {
        const error = await response.json();
        console.error('API error:', error.message);
        return;
    }

    const data = await response.json();
} catch (err) {
    console.error('Network error:', err);
}
```

## Helper Functions

Create typed API helpers:

```jsx
// api/users.js
import { api } from 'webarcade';

export async function getUsers() {
    const res = await api('my-plugin/users');
    return res.json();
}

export async function createUser(user) {
    const res = await api('my-plugin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    return res.json();
}

export async function deleteUser(id) {
    await api(`my-plugin/users/${id}`, { method: 'DELETE' });
}
```

Usage:

```jsx
import { getUsers, createUser, deleteUser } from './api/users';

const users = await getUsers();
const newUser = await createUser({ name: 'Alice' });
await deleteUser(123);
```

## WebSocket Communication

For real-time communication, use the WebSocket server:

```jsx
const ws = new WebSocket('ws://localhost:3002');

ws.onopen = () => {
    console.log('Connected');
    ws.send(JSON.stringify({ type: 'subscribe', channel: 'updates' }));
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Received:', data);
};

ws.onclose = () => {
    console.log('Disconnected');
};
```

## Architecture

```
┌─────────────────┐     HTTP      ┌─────────────────┐
│   SolidJS UI    │ ──────────── │   Bridge Server  │
│   (Frontend)    │  :3001       │   (Rust)        │
└─────────────────┘               └────────┬────────┘
                                           │
                                           ▼
                              ┌─────────────────────────┐
                              │   Plugin DLLs           │
                              │   ├── my-plugin.dll     │
                              │   └── other-plugin.dll  │
                              └─────────────────────────┘
```

The bridge server:
1. Receives HTTP requests from the frontend
2. Routes to the correct plugin based on the URL prefix
3. Calls the plugin's Rust handler
4. Returns the response to the frontend
