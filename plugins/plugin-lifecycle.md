# Plugin Lifecycle

Understanding the plugin lifecycle is essential for building robust WebArcade plugins.

## Lifecycle Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Plugin Loaded                                              │
│    ↓                                                        │
│  start(api)  ─── Register components, shortcuts, services   │
│    ↓                                                        │
│  [Plugin is running]                                        │
│    ↓                                                        │
│  stop(api)  ─── Plugin disabled/unloaded                   │
└─────────────────────────────────────────────────────────────┘
```

## Lifecycle Hooks

### `start(api)`

Called **once** when the plugin is first loaded. Use this to register all components and set up services.

```jsx
start(api) {
    // Register panel components
    api.register('explorer', {
        type: 'panel',
        component: Explorer,
        label: 'Explorer',
        icon: IconFolder
    });

    api.register('editor', {
        type: 'panel',
        component: Editor,
        label: 'Editor'
    });

    // Register toolbar buttons
    api.register('save-btn', {
        type: 'toolbar',
        icon: IconSave,
        tooltip: 'Save (Ctrl+S)',
        onClick: () => saveFile()
    });

    // Register menu items
    api.register('file-menu', {
        type: 'menu',
        label: 'File',
        submenu: [
            { id: 'new', label: 'New', action: () => newFile() }
        ]
    });

    // Register keyboard shortcuts
    api.shortcut({
        'ctrl+s': () => saveFile(),
        'ctrl+n': () => newFile()
    });

    // Provide services for other plugins
    api.provide('editor', {
        openFile: (path) => openFile(path),
        save: () => saveFile()
    });

    // Initialize state
    api.set('editor.currentFile', null);
}
```

### `stop(api)`

Called when the plugin is disabled or the application closes.

```jsx
stop(api) {
    // Save state to disk
    saveState();

    // Clean up subscriptions
    unsubscribeAll();

    // Close connections
    closeConnections();
}
```

## Component Lifecycle Hooks

Individual panel components can have their own lifecycle hooks:

```jsx
api.register('editor', {
    type: 'panel',
    component: Editor,
    label: 'Editor',

    onMount: () => {
        // Called when panel is first rendered
        console.log('Editor mounted');
        loadLastOpenFile();
    },

    onUnmount: () => {
        // Called when panel is removed
        console.log('Editor unmounted');
        saveCurrentFile();
    },

    onFocus: () => {
        // Called when panel receives focus
        console.log('Editor focused');
    },

    onBlur: () => {
        // Called when panel loses focus
        console.log('Editor blurred');
    }
});
```

## Best Practices

### Do in `start()`

- Register all UI components
- Set up keyboard shortcuts
- Provide services for other plugins
- Subscribe to events from other plugins
- Initialize default state
- Register layouts if providing custom layouts

### Do in `stop()`

- Save persistent state
- Unsubscribe from events
- Clean up connections
- Remove any global listeners

## Example: Complete Plugin

```jsx
import { plugin } from '@/api/plugin';
import { createSignal } from 'solid-js';
import { IconNotes, IconPlus, IconTrash } from '@tabler/icons-solidjs';

const [notes, setNotes] = createSignal([]);
const [selectedNote, setSelectedNote] = createSignal(null);

function NoteList() {
    return (
        <div class="p-4">
            <For each={notes()}>
                {(note) => (
                    <div
                        class={`p-2 cursor-pointer ${selectedNote()?.id === note.id ? 'bg-primary' : ''}`}
                        onClick={() => setSelectedNote(note)}
                    >
                        {note.title}
                    </div>
                )}
            </For>
        </div>
    );
}

function NoteEditor() {
    return (
        <div class="p-4">
            <Show when={selectedNote()} fallback={<p>Select a note</p>}>
                <h1 class="text-xl font-bold">{selectedNote().title}</h1>
                <textarea
                    class="w-full h-64 mt-4"
                    value={selectedNote().content}
                    onInput={(e) => updateNote(selectedNote().id, e.target.value)}
                />
            </Show>
        </div>
    );
}

function createNote() {
    const newNote = {
        id: Date.now(),
        title: 'New Note',
        content: ''
    };
    setNotes([...notes(), newNote]);
    setSelectedNote(newNote);
}

function deleteNote(id) {
    setNotes(notes().filter(n => n.id !== id));
    if (selectedNote()?.id === id) {
        setSelectedNote(null);
    }
}

function updateNote(id, content) {
    setNotes(notes().map(n =>
        n.id === id ? { ...n, content } : n
    ));
}

export default plugin({
    id: 'notes',
    name: 'Notes',
    version: '1.0.0',

    start(api) {
        // Load saved notes
        const savedNotes = api.get('notes.list', []);
        setNotes(savedNotes);

        // Register panels
        api.register('note-list', {
            type: 'panel',
            component: NoteList,
            label: 'Notes',
            icon: IconNotes
        });

        api.register('note-editor', {
            type: 'panel',
            component: NoteEditor,
            label: 'Editor'
        });

        // Register toolbar
        api.register('new-note', {
            type: 'toolbar',
            icon: IconPlus,
            tooltip: 'New Note',
            onClick: createNote
        });

        api.register('delete-note', {
            type: 'toolbar',
            icon: IconTrash,
            tooltip: 'Delete Note',
            onClick: () => selectedNote() && deleteNote(selectedNote().id),
            disabled: () => !selectedNote()
        });

        // Keyboard shortcuts
        api.shortcut({
            'ctrl+n': createNote,
            'delete': () => selectedNote() && deleteNote(selectedNote().id)
        });

        // Provide service for other plugins
        api.provide('notes', {
            create: createNote,
            delete: deleteNote,
            getAll: () => notes(),
            getSelected: () => selectedNote()
        });
    },

    stop(api) {
        // Save notes before unloading
        api.set('notes.list', notes());
    }
});
```

## Layout Events

Listen for layout changes if your plugin needs to react:

```jsx
start(api) {
    // Listen for layout changes
    document.addEventListener('layout:change', (event) => {
        const { from, to } = event.detail;
        console.log(`Layout changed from ${from} to ${to}`);
    });
}
```

## Plugin State Management

Use the shared store for persistent state across sessions:

```jsx
start(api) {
    // Load previous state
    const savedState = api.get('myPlugin.state', {
        lastOpenFile: null,
        recentFiles: [],
        settings: { autoSave: true }
    });

    // Initialize with saved state
    initializeApp(savedState);

    // Watch for changes from other plugins
    api.watch('settings.theme', (theme) => {
        applyTheme(theme);
    });
}

stop(api) {
    // Save state for next session
    api.set('myPlugin.state', getCurrentState());
}
```

## Error Handling

Handle errors gracefully in lifecycle hooks:

```jsx
start(api) {
    try {
        // Initialize plugin
        initializeComponents(api);
    } catch (error) {
        console.error('[MyPlugin] Initialization failed:', error);
        // Register minimal error UI
        api.register('error-view', {
            type: 'panel',
            component: () => <div class="p-4 text-error">Plugin failed to load</div>,
            label: 'Error'
        });
    }
}
```
