# Panel System

The panel system is how you add UI to your plugin. This page explains every panel type and option.

## Panel Layout

```
┌─────────────────────────────────────────────────────────────┐
│                    Menu Bar (api.menu)                       │
├─────────────────────────────────────────────────────────────┤
│                    Toolbar (api.toolbar)                     │
├─────────────────────────────────────────────────────────────┤
│                    Plugin Tabs (panel: 'tab')               │
├──────────┬─────────────────────────────┬────────────────────┤
│          │                             │                    │
│  LEFT    │         VIEWPORT            │      RIGHT         │
│  PANEL   │      (panel: 'viewport')    │      PANEL         │
│          │                             │                    │
│ (panel:  │    Main content area        │   (panel:          │
│  'left') │    Can have multiple tabs   │    'right')        │
│          │                             │                    │
├──────────┴─────────────────────────────┴────────────────────┤
│                 BOTTOM PANEL (panel: 'bottom')              │
├─────────────────────────────────────────────────────────────┤
│                    Footer (api.footer)                      │
└─────────────────────────────────────────────────────────────┘
```

## Panel Types

| Panel Type | Location | Purpose | Multiple Tabs? |
|------------|----------|---------|----------------|
| `tab` | Top tab bar | Plugin selector | No (one per plugin) |
| `viewport` | Center | Main content | Yes |
| `left` | Left sidebar | Navigation, files | Yes |
| `right` | Right sidebar | Properties, details | Yes |
| `bottom` | Bottom area | Console, output | Yes |

## Adding Panels with `api.add()`

### Basic Syntax

```jsx
api.add({
    panel: 'viewport',      // Required: where to add
    id: 'my-panel',        // Required: unique identifier
    component: MyComponent, // Required: what to render
    // ... other options
});
```

### All Options

```jsx
api.add({
    // Required
    panel: 'viewport',         // 'tab' | 'viewport' | 'left' | 'right' | 'bottom'
    id: 'unique-id',          // Unique identifier (not needed for 'tab')
    component: MyComponent,    // SolidJS component (not needed for 'tab')

    // Display
    label: 'Tab Label',       // Text shown in tab
    icon: IconComponent,      // Icon shown in tab (optional)

    // Behavior
    visible: true,            // Initial visibility (default: true)
    order: 0,                 // Sort order (lower = first)
    closable: true,           // Can user close this tab? (default: true)
    shared: false,            // Share with other plugins? (default: false)

    // Lifecycle hooks (optional)
    start: (api) => {},       // Called when panel first created
    active: (api) => {},      // Called when plugin becomes active
    inactive: (api) => {},    // Called when plugin becomes inactive
});
```

## Plugin Tab

Every plugin needs a tab to appear in the tab bar:

```jsx
api.add({
    panel: 'tab',
    label: 'My Plugin',      // Required: tab text
    icon: IconHome,          // Optional: tab icon
    order: 1,                // Optional: position in tab bar
});
```

### Tab with Icon

```jsx
import { IconCode } from '@tabler/icons-solidjs';

api.add({
    panel: 'tab',
    label: 'Editor',
    icon: IconCode,
});
```

### Tab Order

Control the order of tabs:

```jsx
// First tab
api.add({ panel: 'tab', label: 'Files', order: 1 });

// Second tab
api.add({ panel: 'tab', label: 'Editor', order: 2 });

// Third tab
api.add({ panel: 'tab', label: 'Settings', order: 3 });
```

## Viewport Panel

The main content area. Supports multiple tabs.

### Single Viewport

```jsx
function MainView() {
    return (
        <div class="p-4">
            <h1>Main Content</h1>
        </div>
    );
}

api.add({
    panel: 'viewport',
    id: 'main',
    label: 'Main',           // Tab label (optional if only one viewport)
    component: MainView,
});
```

### Multiple Viewport Tabs

```jsx
// Tab 1: Editor
api.add({
    panel: 'viewport',
    id: 'editor',
    label: 'Editor',
    icon: IconCode,
    component: EditorView,
    order: 1,
});

// Tab 2: Preview
api.add({
    panel: 'viewport',
    id: 'preview',
    label: 'Preview',
    icon: IconEye,
    component: PreviewView,
    order: 2,
});

// Tab 3: Settings
api.add({
    panel: 'viewport',
    id: 'settings',
    label: 'Settings',
    icon: IconSettings,
    component: SettingsView,
    order: 3,
});
```

### Closable Tabs

Allow users to close tabs:

```jsx
api.add({
    panel: 'viewport',
    id: 'document-1',
    label: 'Document.txt',
    component: DocumentView,
    closable: true,          // User can close this tab
});
```

### Non-Closable Tabs

Prevent users from closing essential tabs:

```jsx
api.add({
    panel: 'viewport',
    id: 'welcome',
    label: 'Welcome',
    component: WelcomeView,
    closable: false,         // User cannot close this tab
});
```

## Left Panel (Sidebar)

Left sidebar for navigation, file trees, etc.

```jsx
function FileExplorer() {
    return (
        <div class="p-2">
            <div class="font-bold mb-2">Files</div>
            <ul class="menu">
                <li><a>index.jsx</a></li>
                <li><a>styles.css</a></li>
                <li><a>utils.js</a></li>
            </ul>
        </div>
    );
}

api.add({
    panel: 'left',
    id: 'files',
    label: 'Files',
    icon: IconFolder,
    component: FileExplorer,
});
```

### Multiple Left Panel Tabs

```jsx
// Tab 1: File explorer
api.add({
    panel: 'left',
    id: 'files',
    label: 'Files',
    icon: IconFolder,
    component: FileExplorer,
    order: 1,
});

// Tab 2: Search
api.add({
    panel: 'left',
    id: 'search',
    label: 'Search',
    icon: IconSearch,
    component: SearchPanel,
    order: 2,
});

// Tab 3: Git
api.add({
    panel: 'left',
    id: 'git',
    label: 'Git',
    icon: IconGitBranch,
    component: GitPanel,
    order: 3,
});
```

## Right Panel (Sidebar)

Right sidebar for properties, details, etc.

```jsx
function PropertiesPanel() {
    return (
        <div class="p-2">
            <div class="font-bold mb-2">Properties</div>
            <div class="space-y-2">
                <div>
                    <label class="text-sm opacity-70">Width</label>
                    <input class="input input-sm input-bordered w-full" value="100" />
                </div>
                <div>
                    <label class="text-sm opacity-70">Height</label>
                    <input class="input input-sm input-bordered w-full" value="200" />
                </div>
            </div>
        </div>
    );
}

api.add({
    panel: 'right',
    id: 'properties',
    label: 'Properties',
    icon: IconSettings,
    component: PropertiesPanel,
});
```

## Bottom Panel

Bottom area for console, output, problems, etc.

```jsx
function ConsolePanel() {
    return (
        <div class="h-full bg-base-300 p-2 font-mono text-sm overflow-auto">
            <div class="text-success">&gt; Build started...</div>
            <div class="text-success">&gt; Compiling plugin...</div>
            <div class="text-success">&gt; Build complete!</div>
        </div>
    );
}

api.add({
    panel: 'bottom',
    id: 'console',
    label: 'Console',
    icon: IconTerminal,
    component: ConsolePanel,
});
```

### Multiple Bottom Panel Tabs

```jsx
// Console
api.add({
    panel: 'bottom',
    id: 'console',
    label: 'Console',
    icon: IconTerminal,
    component: ConsolePanel,
    order: 1,
});

// Output
api.add({
    panel: 'bottom',
    id: 'output',
    label: 'Output',
    icon: IconFileText,
    component: OutputPanel,
    order: 2,
});

// Problems
api.add({
    panel: 'bottom',
    id: 'problems',
    label: 'Problems',
    icon: IconAlertCircle,
    component: ProblemsPanel,
    order: 3,
});
```

## Panel Visibility

### Show/Hide Panels

```jsx
// Show panels
api.showLeft(true);
api.showRight(true);
api.showBottom(true);

// Hide panels
api.showLeft(false);
api.showRight(false);
api.showBottom(false);

// Shorthand to hide
api.hideLeft();
api.hideRight();
api.hideBottom();

// Toggle
api.toggleLeft();
api.toggleRight();
api.toggleBottom();
```

### Using in Lifecycle Hooks

```jsx
export default plugin({
    id: 'my-plugin',
    name: 'My Plugin',
    version: '1.0.0',

    start(api) {
        // Register panels...
    },

    active(api) {
        // Show panels when plugin becomes active
        api.showLeft(true);
        api.showBottom(true);
        api.hideRight();  // Hide right panel
    },

    inactive(api) {
        // Optionally hide panels when switching away
        // api.hideBottom();
    }
});
```

## Focusing Panels

Switch to a specific tab within a panel:

```jsx
// Focus a viewport tab
api.focusViewport('editor');

// Focus a left panel tab
api.focusLeft('files');

// Focus a right panel tab
api.focusRight('properties');

// Focus a bottom panel tab
api.focusBottom('console');
```

### Example: Open File in Editor

```jsx
function openFile(filename) {
    // Add a new viewport tab for this file
    api.add({
        panel: 'viewport',
        id: `file-${filename}`,
        label: filename,
        component: () => <FileEditor filename={filename} />,
        closable: true,
    });

    // Switch to the new tab
    api.focusViewport(`file-${filename}`);
}
```

## Removing Panels

Remove a panel by its ID:

```jsx
// Remove a panel
api.remove('file-document.txt');

// Example: Close file tab
function closeFile(filename) {
    api.remove(`file-${filename}`);
}
```

## Dynamic Panels

Add and remove panels at runtime:

```jsx
import { createSignal, For } from 'solid-js';

const [openFiles, setOpenFiles] = createSignal([]);

function FileList() {
    const addFile = (name) => {
        // Add to our list
        setOpenFiles([...openFiles(), name]);

        // Add a viewport tab
        api.add({
            panel: 'viewport',
            id: `file-${name}`,
            label: name,
            component: () => <FileEditor name={name} />,
            closable: true,
        });

        // Focus it
        api.focusViewport(`file-${name}`);
    };

    const closeFile = (name) => {
        // Remove from our list
        setOpenFiles(openFiles().filter(f => f !== name));

        // Remove the viewport tab
        api.remove(`file-${name}`);
    };

    return (
        <div class="p-2">
            <For each={openFiles()}>
                {(file) => (
                    <div class="flex justify-between items-center">
                        <span>{file}</span>
                        <button onClick={() => closeFile(file)}>×</button>
                    </div>
                )}
            </For>
        </div>
    );
}
```

## Panel Lifecycle Hooks

Each panel can have its own lifecycle hooks:

```jsx
api.add({
    panel: 'viewport',
    id: 'editor',
    label: 'Editor',
    component: EditorView,

    // Called when the panel is first created
    start(api) {
        console.log('Editor panel created');
    },

    // Called when the plugin becomes active
    active(api) {
        console.log('Editor is now visible');
        // Refresh data, start animations, etc.
    },

    // Called when the plugin becomes inactive
    inactive(api) {
        console.log('Editor is now hidden');
        // Pause operations, save state, etc.
    }
});
```

## Complete Example

```jsx
import { plugin } from '@/api/plugin';
import { IconCode, IconFolder, IconTerminal, IconSettings } from '@tabler/icons-solidjs';

// Components
function EditorView() {
    return <div class="p-4">Editor content here</div>;
}

function FileExplorer() {
    return <div class="p-2">File tree here</div>;
}

function ConsolePanel() {
    return <div class="p-2 font-mono">Console output here</div>;
}

function PropertiesPanel() {
    return <div class="p-2">Properties here</div>;
}

export default plugin({
    id: 'code-editor',
    name: 'Code Editor',
    version: '1.0.0',

    start(api) {
        // Plugin tab
        api.add({
            panel: 'tab',
            label: 'Editor',
            icon: IconCode,
        });

        // Main viewport
        api.add({
            panel: 'viewport',
            id: 'editor',
            label: 'Editor',
            component: EditorView,
        });

        // Left sidebar: File explorer
        api.add({
            panel: 'left',
            id: 'files',
            label: 'Files',
            icon: IconFolder,
            component: FileExplorer,
        });

        // Right sidebar: Properties
        api.add({
            panel: 'right',
            id: 'properties',
            label: 'Properties',
            icon: IconSettings,
            component: PropertiesPanel,
        });

        // Bottom panel: Console
        api.add({
            panel: 'bottom',
            id: 'console',
            label: 'Console',
            icon: IconTerminal,
            component: ConsolePanel,
        });
    },

    active(api) {
        // Show sidebars when plugin is active
        api.showLeft(true);
        api.showRight(true);
        api.showBottom(true);
    }
});
```
