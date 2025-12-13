# Plugin Lifecycle

Understanding the plugin lifecycle is essential for building robust WebArcade plugins.

## Lifecycle Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Plugin Loaded                                              │
│    ↓                                                        │
│  start(api)  ─── Register panels, toolbar, menu, footer    │
│    ↓                                                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  User switches plugins (tab bar)                    │    │
│  │    ↓                    ↓                           │    │
│  │  active(api)        inactive(api)                   │    │
│  │  Show panels        (other plugin now active)       │    │
│  └─────────────────────────────────────────────────────┘    │
│    ↓                                                        │
│  stop(api)  ─── Plugin disabled/unloaded                   │
└─────────────────────────────────────────────────────────────┘
```

## Lifecycle Hooks

### `start(api)`

Called **once** when the plugin is first loaded. Use this to register all UI components.

```jsx
start(api) {
    // Register your tab
    api.add({
        panel: 'tab',
        label: 'My Plugin',
        icon: MyIcon,
    });

    // Register all panels
    api.add({ panel: 'viewport', id: 'main', component: MainView });
    api.add({ panel: 'left', id: 'explorer', label: 'Explorer', component: Explorer });

    // Register toolbar buttons
    api.toolbar('save', {
        icon: IconSave,
        tooltip: 'Save',
        onClick: () => saveFile(),
    });

    // Register menu items
    api.menu('file', {
        label: 'File',
        submenu: [
            { id: 'new', label: 'New', action: () => newFile() },
        ]
    });
}
```

### `active(api)`

Called each time the user switches **to** this plugin via the tab bar.

```jsx
active(api) {
    // Show panels that should be visible for this plugin
    api.showLeft(true);
    api.showBottom(true);

    // Focus a specific viewport tab
    api.focusViewport('editor');

    // Load data or refresh state
    loadProjectFiles();
}
```

### `inactive(api)`

Called each time the user switches **away** from this plugin.

```jsx
inactive(api) {
    // Save unsaved state
    saveCurrentState();

    // Optionally hide panels
    api.hideBottom();

    // Pause background tasks
    pauseAutoRefresh();
}
```

### `stop(api)`

Called when the plugin is disabled or the application closes.

```jsx
stop(api) {
    // Clean up resources
    closeConnections();

    // Save state to disk
    saveState();

    // Unsubscribe from events
    unsubscribeAll();
}
```

## Panel-Level Lifecycle

Individual panels can also have lifecycle hooks:

```jsx
api.add({
    panel: 'viewport',
    id: 'editor',
    component: Editor,

    start(api) {
        // Called when panel is first created
        console.log('Editor panel created');
    },

    active(api) {
        // Called when plugin becomes active
        console.log('Editor is visible');
    },

    inactive(api) {
        // Called when plugin becomes inactive
        console.log('Editor is hidden');
    }
});
```

## Best Practices

### Do in `start()`
- Register all UI components (panels, toolbar, menu)
- Set up services for other plugins
- Initialize one-time resources

### Do in `active()`
- Show/hide panels based on context
- Refresh data that may have changed
- Resume paused operations

### Do in `inactive()`
- Save state to prevent data loss
- Pause expensive operations
- Clean up temporary UI state

### Do in `stop()`
- Save all persistent state
- Clean up subscriptions
- Close connections

## Example: Complete Lifecycle

```jsx
import { plugin } from '@/api/plugin';

export default plugin({
    id: 'notes',
    name: 'Notes',
    version: '1.0.0',

    state: {
        notes: [],
        currentNote: null,
    },

    start(api) {
        // Load saved notes
        this.state.notes = api.get('notes.list', []);

        // Register UI
        api.add({ panel: 'tab', label: 'Notes' });
        api.add({ panel: 'viewport', id: 'editor', component: NoteEditor });
        api.add({ panel: 'left', id: 'list', label: 'Notes', component: NoteList });
    },

    active(api) {
        // Refresh notes list
        api.showLeft(true);
    },

    inactive(api) {
        // Auto-save current note
        if (this.state.currentNote?.modified) {
            this.saveNote(this.state.currentNote);
        }
    },

    stop(api) {
        // Save all notes
        api.set('notes.list', this.state.notes);
    }
});
```
