# Window & Desktop APIs

WebArcade provides APIs for controlling the desktop window and accessing native system features.

## Window Control

### api.window

Control the application window programmatically.

```jsx
import { api } from 'webarcade';

// Minimize the window
api.window.minimize();

// Maximize the window
api.window.maximize();

// Restore from maximized/minimized
api.window.restore();

// Close the application
api.window.close();

// Toggle fullscreen
api.window.fullscreen();
api.window.exitFullscreen();
api.window.toggleFullscreen();

// Check window state
const isMaximized = api.window.isMaximized();
const isMinimized = api.window.isMinimized();
const isFullscreen = api.window.isFullscreen();
```

### Window Properties

```jsx
// Get window size
const { width, height } = api.window.getSize();

// Set window size
api.window.setSize(1280, 720);

// Get window position
const { x, y } = api.window.getPosition();

// Set window position
api.window.setPosition(100, 100);

// Center window on screen
api.window.center();

// Set window title
api.window.setTitle('My Application');

// Set always on top
api.window.setAlwaysOnTop(true);
api.window.setAlwaysOnTop(false);
```

### Window Events

Listen for window state changes:

```jsx
// Window resized
api.window.on('resize', ({ width, height }) => {
    console.log(`Window resized to ${width}x${height}`);
});

// Window moved
api.window.on('move', ({ x, y }) => {
    console.log(`Window moved to ${x}, ${y}`);
});

// Window focused/blurred
api.window.on('focus', () => console.log('Window focused'));
api.window.on('blur', () => console.log('Window lost focus'));

// Window state changes
api.window.on('maximize', () => console.log('Maximized'));
api.window.on('minimize', () => console.log('Minimized'));
api.window.on('restore', () => console.log('Restored'));

// Before close (can prevent closing)
api.window.on('close-requested', (event) => {
    if (hasUnsavedChanges()) {
        event.preventDefault();
        showSaveDialog();
    }
});
```

---

## File System API

Access the file system through the Rust backend.

### Reading Files

```jsx
// Read a text file
const content = await api('my-plugin/fs/read', {
    method: 'POST',
    body: JSON.stringify({ path: '/path/to/file.txt' })
}).then(r => r.text());

// Read a binary file (base64 encoded)
const data = await api('my-plugin/fs/read-binary', {
    method: 'POST',
    body: JSON.stringify({ path: '/path/to/image.png' })
}).then(r => r.json());
```

### Writing Files

```jsx
// Write a text file
await api('my-plugin/fs/write', {
    method: 'POST',
    body: JSON.stringify({
        path: '/path/to/file.txt',
        content: 'Hello, World!'
    })
});

// Write binary data
await api('my-plugin/fs/write-binary', {
    method: 'POST',
    body: JSON.stringify({
        path: '/path/to/output.png',
        data: base64EncodedData
    })
});
```

### Directory Operations

```jsx
// List directory contents
const files = await api('my-plugin/fs/list', {
    method: 'POST',
    body: JSON.stringify({ path: '/path/to/directory' })
}).then(r => r.json());

// Create directory
await api('my-plugin/fs/mkdir', {
    method: 'POST',
    body: JSON.stringify({ path: '/path/to/new-folder' })
});

// Delete file or directory
await api('my-plugin/fs/delete', {
    method: 'POST',
    body: JSON.stringify({ path: '/path/to/delete' })
});

// Check if path exists
const exists = await api('my-plugin/fs/exists', {
    method: 'POST',
    body: JSON.stringify({ path: '/path/to/check' })
}).then(r => r.json());

// Get file info
const info = await api('my-plugin/fs/stat', {
    method: 'POST',
    body: JSON.stringify({ path: '/path/to/file' })
}).then(r => r.json());
// Returns: { size, modified, created, isFile, isDirectory }
```

### File Dialogs

```jsx
// Open file dialog
const filePath = await api.dialog.open({
    title: 'Select a file',
    filters: [
        { name: 'Images', extensions: ['png', 'jpg', 'gif'] },
        { name: 'All Files', extensions: ['*'] }
    ],
    multiple: false,
    directory: false
});

// Open folder dialog
const folderPath = await api.dialog.open({
    title: 'Select a folder',
    directory: true
});

// Save file dialog
const savePath = await api.dialog.save({
    title: 'Save file',
    defaultPath: 'document.txt',
    filters: [
        { name: 'Text Files', extensions: ['txt'] }
    ]
});

// Message dialog
const result = await api.dialog.message({
    title: 'Confirm',
    message: 'Are you sure you want to delete this file?',
    type: 'warning', // 'info' | 'warning' | 'error'
    buttons: ['Cancel', 'Delete'],
    defaultId: 0,
    cancelId: 0
});
// result = index of clicked button
```

---

## Shell API

Execute system commands and open external resources.

### Open External URLs

```jsx
// Open URL in default browser
api.shell.openExternal('https://example.com');

// Open file with default application
api.shell.openPath('/path/to/document.pdf');

// Show file in file explorer
api.shell.showItemInFolder('/path/to/file.txt');
```

### Execute Commands

::: warning
Shell command execution requires the `shell` capability in your `plugin.toml`.
:::

```jsx
// Execute a shell command
const result = await api('my-plugin/shell/exec', {
    method: 'POST',
    body: JSON.stringify({
        command: 'ls',
        args: ['-la', '/path/to/dir'],
        cwd: '/working/directory'
    })
}).then(r => r.json());

// result = { stdout, stderr, exitCode }
```

---

## System Tray

Add a system tray icon for your application.

### Creating a Tray

```jsx
// Set up system tray
api.tray.setIcon('/path/to/icon.png');
api.tray.setTooltip('My Application');

// Set tray menu
api.tray.setMenu([
    { id: 'show', label: 'Show Window' },
    { id: 'hide', label: 'Hide Window' },
    { type: 'separator' },
    { id: 'quit', label: 'Quit' }
]);

// Handle tray menu clicks
api.tray.on('menu-click', (id) => {
    switch (id) {
        case 'show':
            api.window.restore();
            api.window.focus();
            break;
        case 'hide':
            api.window.minimize();
            break;
        case 'quit':
            api.window.close();
            break;
    }
});

// Handle tray icon click
api.tray.on('click', () => {
    api.window.restore();
    api.window.focus();
});

// Handle tray icon double-click
api.tray.on('double-click', () => {
    api.window.toggleMaximize();
});
```

### Tray Notifications

```jsx
// Show a notification
api.notification.show({
    title: 'Download Complete',
    body: 'Your file has finished downloading.',
    icon: '/path/to/icon.png'
});

// Notification with actions
api.notification.show({
    title: 'New Message',
    body: 'You have a new message from John',
    actions: [
        { id: 'reply', label: 'Reply' },
        { id: 'dismiss', label: 'Dismiss' }
    ]
});

// Handle notification actions
api.notification.on('action', (notificationId, actionId) => {
    if (actionId === 'reply') {
        openReplyDialog();
    }
});
```

---

## Clipboard

Access the system clipboard.

```jsx
// Write text to clipboard
api.clipboard.writeText('Hello, World!');

// Read text from clipboard
const text = await api.clipboard.readText();

// Write HTML to clipboard
api.clipboard.writeHTML('<b>Bold text</b>');

// Read HTML from clipboard
const html = await api.clipboard.readHTML();

// Write image to clipboard (base64)
api.clipboard.writeImage(base64ImageData);

// Read image from clipboard
const imageData = await api.clipboard.readImage();

// Clear clipboard
api.clipboard.clear();
```

---

## Multi-Window Support

Create and manage multiple windows.

### Creating Windows

```jsx
// Create a new window
const newWindow = await api.window.create({
    title: 'Settings',
    width: 600,
    height: 400,
    url: '/settings',  // Route to load
    resizable: true,
    minimizable: true,
    maximizable: true,
    closable: true,
    alwaysOnTop: false
});

// Get window ID
const windowId = newWindow.id;

// Close the window
newWindow.close();
```

### Window Communication

```jsx
// Send message to another window
api.window.send(windowId, 'update-settings', { theme: 'dark' });

// Listen for messages from other windows
api.window.on('message', (senderId, channel, data) => {
    if (channel === 'update-settings') {
        applySettings(data);
    }
});

// Broadcast to all windows
api.window.broadcast('theme-changed', { theme: 'dark' });
```

---

## Native Menus

Create native application menus.

### Application Menu

```jsx
// Set the application menu (macOS menu bar)
api.menu.setApplicationMenu([
    {
        label: 'File',
        submenu: [
            { label: 'New', accelerator: 'CmdOrCtrl+N', click: () => newFile() },
            { label: 'Open', accelerator: 'CmdOrCtrl+O', click: () => openFile() },
            { type: 'separator' },
            { label: 'Save', accelerator: 'CmdOrCtrl+S', click: () => saveFile() },
            { label: 'Save As...', accelerator: 'CmdOrCtrl+Shift+S', click: () => saveFileAs() },
            { type: 'separator' },
            { role: 'quit' }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'selectAll' }
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'toggleDevTools' },
            { type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    }
]);
```

### Context Menu

```jsx
// Show context menu at cursor position
api.menu.popup([
    { label: 'Cut', accelerator: 'CmdOrCtrl+X', click: () => cut() },
    { label: 'Copy', accelerator: 'CmdOrCtrl+C', click: () => copy() },
    { label: 'Paste', accelerator: 'CmdOrCtrl+V', click: () => paste() },
    { type: 'separator' },
    { label: 'Delete', click: () => deleteItem() }
]);
```

---

## Drag and Drop

Handle file drag and drop.

```jsx
// Enable drop zone on an element
function DropZone() {
    const handleDrop = (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;

        for (const file of files) {
            console.log('Dropped file:', file.path);
            // Process the file
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    };

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            class="border-2 border-dashed p-8"
        >
            Drop files here
        </div>
    );
}
```

### Start Drag Operation

```jsx
// Start dragging a file
api.drag.startDrag({
    file: '/path/to/file.txt',
    icon: '/path/to/icon.png'
});
```

---

## Complete Example

```jsx
import { plugin, api } from 'webarcade';

export default plugin({
    id: 'desktop-demo',
    name: 'Desktop Demo',
    version: '1.0.0',

    start(api) {
        // Set up system tray
        api.tray.setIcon('/icons/tray.png');
        api.tray.setTooltip('Desktop Demo');
        api.tray.setMenu([
            { id: 'show', label: 'Show' },
            { type: 'separator' },
            { id: 'quit', label: 'Quit' }
        ]);

        api.tray.on('menu-click', (id) => {
            if (id === 'show') {
                api.window.restore();
                api.window.focus();
            } else if (id === 'quit') {
                api.window.close();
            }
        });

        // Handle close request
        api.window.on('close-requested', async (event) => {
            if (hasUnsavedChanges()) {
                event.preventDefault();
                const result = await api.dialog.message({
                    title: 'Unsaved Changes',
                    message: 'You have unsaved changes. Save before closing?',
                    buttons: ['Save', "Don't Save", 'Cancel'],
                    defaultId: 0,
                    cancelId: 2
                });

                if (result === 0) {
                    await saveChanges();
                    api.window.close();
                } else if (result === 1) {
                    api.window.close();
                }
                // Cancel: do nothing, window stays open
            }
        });

        // Register panels...
        api.register('main-view', {
            type: 'panel',
            component: MainView,
            label: 'Desktop Demo'
        });
    },

    stop(api) {
        // Clean up tray
        api.tray.remove();
    }
});
```
