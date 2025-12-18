# Using Themes

Learn how to work with themes in your plugins.

## Setting the Theme

```jsx
// Set theme by name
api.theme.set('dracula');

// Get current theme
const currentTheme = api.theme.get();

// Check if dark theme
const isDark = api.theme.isDark();
```

## Theme Selector Component

```jsx
import { createSignal, For } from 'solid-js';

function ThemeSelector() {
    const themes = api.theme.list();
    const [current, setCurrent] = createSignal(api.theme.get());

    const changeTheme = (theme) => {
        api.theme.set(theme);
        setCurrent(theme);
    };

    return (
        <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn m-1">
                Theme: {current()}
            </label>
            <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 max-h-80 overflow-y-auto">
                <For each={themes}>
                    {(theme) => (
                        <li>
                            <a
                                class={current() === theme ? 'active' : ''}
                                onClick={() => changeTheme(theme)}
                            >
                                {theme}
                            </a>
                        </li>
                    )}
                </For>
            </ul>
        </div>
    );
}
```

---

## Listening for Theme Changes

```jsx
// Listen for theme changes
api.theme.on('change', (newTheme, oldTheme) => {
    console.log(`Theme changed from ${oldTheme} to ${newTheme}`);
    updateChartColors();
});
```

---

## System Theme Detection

### Follow System Preference

```jsx
// Follow system preference
api.theme.setAuto();

// Check if following system
const isAuto = api.theme.isAuto();

// Get system preference
const systemPreference = api.theme.getSystemPreference();
// Returns: 'light' | 'dark'
```

### Manual Dark Mode Toggle

```jsx
import { IconSun, IconMoon } from '@tabler/icons-solidjs';

function DarkModeToggle() {
    const isDark = () => api.theme.isDark();

    const toggle = () => {
        if (isDark()) {
            api.theme.set('light');
        } else {
            api.theme.set('dark');
        }
    };

    return (
        <button class="btn btn-ghost" onClick={toggle}>
            {isDark() ? <IconSun /> : <IconMoon />}
        </button>
    );
}
```

---

## Theme Persistence

Themes are automatically saved to localStorage:

```jsx
// Theme is saved automatically
api.theme.set('dracula');

// On next app start, 'dracula' will be restored

// Clear saved theme
api.theme.clear();

// Disable persistence
api.theme.setPersistence(false);
```

---

## Plugin Theme Hooks

Respond to theme changes in your plugin:

```jsx
export default plugin({
    id: 'chart-plugin',
    name: 'Chart Plugin',
    version: '1.0.0',

    start(api) {
        // Set up initial colors
        this.updateChartColors();

        // Listen for theme changes
        api.theme.on('change', () => {
            this.updateChartColors();
        });
    },

    updateChartColors() {
        const style = getComputedStyle(document.documentElement);

        this.chartColors = {
            primary: style.getPropertyValue('--p'),
            secondary: style.getPropertyValue('--s'),
            accent: style.getPropertyValue('--a'),
            success: style.getPropertyValue('--su'),
            warning: style.getPropertyValue('--wa'),
            error: style.getPropertyValue('--er')
        };

        // Update chart with new colors
        this.chart?.update();
    }
});
```

---

## Complete Example

```jsx
import { plugin } from '@/api/plugin';
import { createSignal, For } from 'solid-js';
import { IconSun, IconMoon, IconPalette } from '@tabler/icons-solidjs';

function ThemeSettings() {
    const [currentTheme, setCurrentTheme] = createSignal(api.theme.get());
    const [isAuto, setIsAuto] = createSignal(api.theme.isAuto());

    const themes = {
        light: ['light', 'cupcake', 'corporate', 'garden', 'lofi', 'pastel', 'winter'],
        dark: ['dark', 'dracula', 'night', 'synthwave', 'forest', 'black', 'coffee', 'dim']
    };

    const setTheme = (theme) => {
        api.theme.set(theme);
        setCurrentTheme(theme);
        setIsAuto(false);
    };

    const toggleAuto = () => {
        if (isAuto()) {
            api.theme.set('light');
            setIsAuto(false);
        } else {
            api.theme.setAuto();
            setIsAuto(true);
        }
        setCurrentTheme(api.theme.get());
    };

    return (
        <div class="p-6">
            <h1 class="text-2xl font-bold mb-6">Theme Settings</h1>

            {/* Auto mode toggle */}
            <div class="form-control mb-6">
                <label class="label cursor-pointer">
                    <span class="label-text">Follow system theme</span>
                    <input
                        type="checkbox"
                        class="toggle toggle-primary"
                        checked={isAuto()}
                        onChange={toggleAuto}
                    />
                </label>
            </div>

            {/* Light themes */}
            <h2 class="text-lg font-semibold mb-3">Light Themes</h2>
            <div class="grid grid-cols-4 gap-3 mb-6">
                <For each={themes.light}>
                    {(theme) => (
                        <button
                            class={`btn btn-sm ${currentTheme() === theme ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setTheme(theme)}
                        >
                            {theme}
                        </button>
                    )}
                </For>
            </div>

            {/* Dark themes */}
            <h2 class="text-lg font-semibold mb-3">Dark Themes</h2>
            <div class="grid grid-cols-4 gap-3 mb-6">
                <For each={themes.dark}>
                    {(theme) => (
                        <button
                            class={`btn btn-sm ${currentTheme() === theme ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setTheme(theme)}
                        >
                            {theme}
                        </button>
                    )}
                </For>
            </div>

            {/* Preview */}
            <h2 class="text-lg font-semibold mb-3">Preview</h2>
            <div class="p-4 bg-base-200 rounded-lg">
                <div class="flex gap-2 mb-4">
                    <button class="btn btn-primary">Primary</button>
                    <button class="btn btn-secondary">Secondary</button>
                    <button class="btn btn-accent">Accent</button>
                </div>
                <div class="flex gap-2 mb-4">
                    <span class="badge badge-info">Info</span>
                    <span class="badge badge-success">Success</span>
                    <span class="badge badge-warning">Warning</span>
                    <span class="badge badge-error">Error</span>
                </div>
                <input type="text" class="input input-bordered w-full" placeholder="Input field" />
            </div>
        </div>
    );
}

export default plugin({
    id: 'theme-settings',
    name: 'Theme Settings',
    version: '1.0.0',

    start(api) {
        api.register('theme-settings', {
            type: 'panel',
            component: ThemeSettings,
            label: 'Themes',
            icon: IconPalette
        });
    }
});
```
