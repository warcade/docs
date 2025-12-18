# Error Handling Best Practices

This guide covers error handling patterns and best practices for WebArcade plugins.

## Frontend Error Handling

### Try-Catch Patterns

```jsx
// Basic try-catch
async function fetchData() {
    try {
        const response = await api('my-plugin/data');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch data:', error);
        showErrorNotification('Failed to load data');
        return null;
    }
}
```

### Error Boundaries

Create error boundaries to catch rendering errors:

```jsx
import { ErrorBoundary } from 'solid-js';

function MyPlugin() {
    return (
        <ErrorBoundary
            fallback={(error, reset) => (
                <div class="p-4 text-center">
                    <h2 class="text-xl font-bold text-error">Something went wrong</h2>
                    <p class="text-sm opacity-70 mb-4">{error.message}</p>
                    <button class="btn btn-primary" onClick={reset}>
                        Try Again
                    </button>
                </div>
            )}
        >
            <MainContent />
        </ErrorBoundary>
    );
}
```

### Resource Loading Errors

Handle errors in SolidJS resources:

```jsx
import { createResource, Show, Switch, Match } from 'solid-js';

function DataView() {
    const [data, { refetch }] = createResource(fetchData);

    return (
        <Switch>
            <Match when={data.loading}>
                <div class="loading loading-spinner loading-lg"></div>
            </Match>
            <Match when={data.error}>
                <div class="alert alert-error">
                    <span>Error: {data.error.message}</span>
                    <button class="btn btn-sm" onClick={refetch}>Retry</button>
                </div>
            </Match>
            <Match when={data()}>
                <DataDisplay data={data()} />
            </Match>
        </Switch>
    );
}
```

---

## API Error Handling

### HTTP Request Errors

```jsx
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await api(endpoint, options);

        // Handle HTTP errors
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(
                errorData.message || `HTTP ${response.status}`,
                response.status,
                errorData
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        // Network errors
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new NetworkError('Network connection failed');
        }

        throw error;
    }
}

// Custom error classes
class ApiError extends Error {
    constructor(message, status, data = {}) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

class NetworkError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NetworkError';
    }
}
```

### Handling Different Error Types

```jsx
async function handleOperation() {
    try {
        await performOperation();
    } catch (error) {
        if (error instanceof ApiError) {
            switch (error.status) {
                case 400:
                    showToast('Invalid request. Please check your input.', 'error');
                    break;
                case 401:
                    showToast('Please log in to continue.', 'warning');
                    redirectToLogin();
                    break;
                case 403:
                    showToast('You do not have permission for this action.', 'error');
                    break;
                case 404:
                    showToast('The requested item was not found.', 'error');
                    break;
                case 429:
                    showToast('Too many requests. Please wait.', 'warning');
                    break;
                case 500:
                    showToast('Server error. Please try again later.', 'error');
                    break;
                default:
                    showToast(`Error: ${error.message}`, 'error');
            }
        } else if (error instanceof NetworkError) {
            showToast('Network connection lost. Check your internet.', 'error');
        } else {
            showToast('An unexpected error occurred.', 'error');
            console.error('Unexpected error:', error);
        }
    }
}
```

---

## Rust Backend Error Handling

### Using Result Types

```rust
use api::{HttpRequest, HttpResponse, json_response, error_response};
use serde::Deserialize;

#[derive(Deserialize)]
struct CreateUserRequest {
    name: String,
    email: String,
}

pub async fn handle_create_user(req: HttpRequest) -> HttpResponse {
    // Parse request body
    let user_data: CreateUserRequest = match req.body_json() {
        Ok(data) => data,
        Err(e) => return error_response(400, &format!("Invalid JSON: {}", e)),
    };

    // Validate input
    if user_data.name.is_empty() {
        return error_response(400, "Name is required");
    }

    if !is_valid_email(&user_data.email) {
        return error_response(400, "Invalid email format");
    }

    // Perform operation
    match create_user(&user_data).await {
        Ok(user) => json_response(&user),
        Err(e) => {
            eprintln!("Failed to create user: {:?}", e);
            error_response(500, "Failed to create user")
        }
    }
}

fn is_valid_email(email: &str) -> bool {
    email.contains('@') && email.contains('.')
}
```

### Custom Error Types

```rust
use std::fmt;

#[derive(Debug)]
enum PluginError {
    NotFound(String),
    ValidationError(String),
    DatabaseError(String),
    Unauthorized,
    Forbidden,
}

impl fmt::Display for PluginError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            PluginError::NotFound(msg) => write!(f, "Not found: {}", msg),
            PluginError::ValidationError(msg) => write!(f, "Validation error: {}", msg),
            PluginError::DatabaseError(msg) => write!(f, "Database error: {}", msg),
            PluginError::Unauthorized => write!(f, "Unauthorized"),
            PluginError::Forbidden => write!(f, "Forbidden"),
        }
    }
}

impl PluginError {
    fn to_response(&self) -> HttpResponse {
        match self {
            PluginError::NotFound(msg) => error_response(404, msg),
            PluginError::ValidationError(msg) => error_response(400, msg),
            PluginError::DatabaseError(_) => error_response(500, "Internal server error"),
            PluginError::Unauthorized => error_response(401, "Unauthorized"),
            PluginError::Forbidden => error_response(403, "Forbidden"),
        }
    }
}
```

---

## User-Friendly Error Messages

### Error Message Guidelines

1. **Be specific** - Tell users what went wrong
2. **Be helpful** - Suggest how to fix the problem
3. **Be concise** - Keep messages short
4. **Avoid technical jargon** - Use plain language

```jsx
// Bad error messages
"Error: ENOENT"
"Failed: status 500"
"Something went wrong"

// Good error messages
"File not found. Please check the file path."
"Server is temporarily unavailable. Please try again in a few minutes."
"Could not save changes. You may not have permission to edit this file."
```

### Toast Notifications

```jsx
function showToast(message, type = 'info') {
    api.notification.show({
        message,
        type, // 'info' | 'success' | 'warning' | 'error'
        duration: type === 'error' ? 5000 : 3000
    });
}

// Usage
showToast('File saved successfully', 'success');
showToast('Please check your input', 'warning');
showToast('Failed to connect to server', 'error');
```

### Error Dialog

```jsx
async function showErrorDialog(error) {
    const result = await api.dialog.message({
        title: 'Error',
        message: error.message,
        detail: error.details || '',
        type: 'error',
        buttons: ['OK', 'Report Issue']
    });

    if (result === 1) {
        reportIssue(error);
    }
}
```

---

## Logging

### Console Logging

```jsx
// Use appropriate log levels
console.log('Info: Normal operation');
console.warn('Warning: Potential issue');
console.error('Error: Something failed', error);

// Group related logs
console.group('Loading data');
console.log('Fetching from API...');
console.log('Processing response...');
console.log('Done');
console.groupEnd();
```

### Error Reporting

```jsx
// Send errors to a logging service
function reportError(error, context = {}) {
    const errorReport = {
        message: error.message,
        stack: error.stack,
        context: {
            ...context,
            pluginId: 'my-plugin',
            pluginVersion: '1.0.0',
            timestamp: new Date().toISOString()
        }
    };

    // Send to backend
    api('my-plugin/errors', {
        method: 'POST',
        body: JSON.stringify(errorReport)
    }).catch(() => {
        // Silently fail if error reporting itself fails
        console.error('Failed to report error:', error);
    });
}
```

---

## Graceful Degradation

### Feature Detection

```jsx
async function initPlugin(api) {
    // Check for required features
    if (!api.hasCapability('filesystem')) {
        showWarning('File system access is not available. Some features may be limited.');
        initWithoutFilesystem();
        return;
    }

    // Check for optional dependencies
    let gitIntegration = null;
    if (await api.hasPlugin('git-integration')) {
        gitIntegration = await api.use('git-integration');
    }

    // Initialize with available features
    initWithFeatures({ gitIntegration });
}
```

### Fallback Behavior

```jsx
async function saveFile(path, content) {
    try {
        // Try to save using filesystem API
        await api('my-plugin/fs/write', {
            method: 'POST',
            body: JSON.stringify({ path, content })
        });
        showToast('File saved', 'success');
    } catch (error) {
        // Fall back to download
        console.warn('Filesystem write failed, falling back to download');
        downloadFile(path, content);
        showToast('File downloaded (filesystem access unavailable)', 'warning');
    }
}

function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
```

---

## Complete Example

```jsx
import { plugin } from 'webarcade';
import { createSignal, createResource, ErrorBoundary, Show, Switch, Match } from 'solid-js';

// Custom error classes
class ApiError extends Error {
    constructor(message, status, data = {}) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

// API wrapper with error handling
async function fetchFromApi(endpoint) {
    const response = await api(`my-plugin/${endpoint}`);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
            errorData.message || `Request failed with status ${response.status}`,
            response.status,
            errorData
        );
    }

    return response.json();
}

// Error display component
function ErrorDisplay({ error, onRetry }) {
    const getErrorInfo = () => {
        if (error instanceof ApiError) {
            switch (error.status) {
                case 404: return { title: 'Not Found', message: 'The requested item could not be found.' };
                case 403: return { title: 'Access Denied', message: 'You do not have permission to access this.' };
                case 500: return { title: 'Server Error', message: 'Something went wrong on the server.' };
                default: return { title: 'Error', message: error.message };
            }
        }
        return { title: 'Error', message: error.message || 'An unexpected error occurred.' };
    };

    const info = getErrorInfo();

    return (
        <div class="alert alert-error">
            <div>
                <h3 class="font-bold">{info.title}</h3>
                <p class="text-sm">{info.message}</p>
            </div>
            <Show when={onRetry}>
                <button class="btn btn-sm" onClick={onRetry}>Retry</button>
            </Show>
        </div>
    );
}

// Main component with error handling
function DataViewer() {
    const [data, { refetch }] = createResource(() => fetchFromApi('data'));

    return (
        <div class="p-4">
            <Switch>
                <Match when={data.loading}>
                    <div class="flex justify-center p-8">
                        <span class="loading loading-spinner loading-lg"></span>
                    </div>
                </Match>
                <Match when={data.error}>
                    <ErrorDisplay error={data.error} onRetry={refetch} />
                </Match>
                <Match when={data()}>
                    <div class="space-y-4">
                        {/* Render data */}
                    </div>
                </Match>
            </Switch>
        </div>
    );
}

// Plugin definition
export default plugin({
    id: 'error-handling-example',
    name: 'Error Handling Example',
    version: '1.0.0',

    start(api) {
        // Global error handler
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            api.notification.show({
                message: 'An unexpected error occurred',
                type: 'error'
            });
        });

        api.register('data-viewer', {
            type: 'panel',
            label: 'Data Viewer',
            component: () => (
                <ErrorBoundary
                    fallback={(error, reset) => (
                        <div class="p-8 text-center">
                            <h2 class="text-2xl font-bold text-error mb-4">
                                Something went wrong
                            </h2>
                            <p class="mb-4 opacity-70">{error.message}</p>
                            <button class="btn btn-primary" onClick={reset}>
                                Try Again
                            </button>
                        </div>
                    )}
                >
                    <DataViewer />
                </ErrorBoundary>
            )
        });
    }
});
```
