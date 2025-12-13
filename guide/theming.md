# Theming

WebArcade uses DaisyUI for theming, providing a consistent and customizable appearance across all plugins.

## Built-in Themes

WebArcade includes several built-in themes:

### Light Themes
- `light` - Default light theme
- `cupcake` - Soft pink and purple
- `bumblebee` - Yellow and black
- `emerald` - Green focused
- `corporate` - Professional blue
- `garden` - Nature inspired
- `lofi` - Low contrast light
- `pastel` - Soft pastel colors
- `fantasy` - Purple and pink
- `wireframe` - Minimal wireframe style
- `cmyk` - Print-inspired colors
- `autumn` - Warm fall colors
- `acid` - Bright neon colors
- `lemonade` - Fresh citrus colors
- `winter` - Cool winter tones

### Dark Themes
- `dark` - Default dark theme
- `synthwave` - Retro 80s neon
- `halloween` - Orange and purple
- `forest` - Dark green
- `aqua` - Teal and cyan
- `black` - Pure black
- `luxury` - Gold and black
- `dracula` - Popular dark theme
- `business` - Professional dark
- `night` - Deep blue night
- `coffee` - Brown tones
- `dim` - Subtle dark
- `nord` - Nordic color palette
- `sunset` - Warm sunset colors

---

## Using Themes

### Setting the Theme

```jsx
// Set theme programmatically
api.theme.set('dracula');

// Get current theme
const currentTheme = api.theme.get();

// Check if dark theme
const isDark = api.theme.isDark();
```

### Theme Selector Component

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

### Listening for Theme Changes

```jsx
// Listen for theme changes
api.theme.on('change', (newTheme, oldTheme) => {
    console.log(`Theme changed from ${oldTheme} to ${newTheme}`);
    updateChartColors();
});
```

---

## Theme Colors

DaisyUI themes provide semantic color classes:

### Primary Colors

| Class | Description |
|-------|-------------|
| `primary` | Main brand color |
| `primary-focus` | Darker primary for focus |
| `primary-content` | Text on primary background |
| `secondary` | Secondary brand color |
| `secondary-focus` | Darker secondary |
| `secondary-content` | Text on secondary |
| `accent` | Accent highlight color |
| `accent-focus` | Darker accent |
| `accent-content` | Text on accent |
| `neutral` | Neutral gray color |
| `neutral-focus` | Darker neutral |
| `neutral-content` | Text on neutral |

### Base Colors

| Class | Description |
|-------|-------------|
| `base-100` | Main background |
| `base-200` | Slightly darker background |
| `base-300` | Even darker background |
| `base-content` | Default text color |

### Status Colors

| Class | Description |
|-------|-------------|
| `info` | Information (blue) |
| `success` | Success (green) |
| `warning` | Warning (yellow) |
| `error` | Error (red) |

### Using Theme Colors

```jsx
// In JSX with Tailwind classes
<div class="bg-base-100 text-base-content">
    <button class="btn btn-primary">Primary Button</button>
    <button class="btn btn-secondary">Secondary Button</button>
    <span class="text-success">Success text</span>
    <span class="text-error">Error text</span>
</div>

// Backgrounds
<div class="bg-primary text-primary-content">Primary background</div>
<div class="bg-base-200">Slightly darker background</div>

// Borders
<div class="border border-base-300">Border color</div>
<div class="border border-primary">Primary border</div>
```

---

## Custom Themes

### Creating a Custom Theme

Create a custom theme in your plugin's CSS:

```css
/* styles/custom-theme.css */
[data-theme="my-custom-theme"] {
    --p: 262 80% 50%;           /* primary */
    --pf: 262 80% 40%;          /* primary-focus */
    --pc: 0 0% 100%;            /* primary-content */

    --s: 314 100% 47%;          /* secondary */
    --sf: 314 100% 37%;         /* secondary-focus */
    --sc: 0 0% 100%;            /* secondary-content */

    --a: 174 60% 51%;           /* accent */
    --af: 174 60% 41%;          /* accent-focus */
    --ac: 0 0% 100%;            /* accent-content */

    --n: 219 14% 28%;           /* neutral */
    --nf: 219 14% 18%;          /* neutral-focus */
    --nc: 0 0% 100%;            /* neutral-content */

    --b1: 220 13% 18%;          /* base-100 */
    --b2: 220 13% 14%;          /* base-200 */
    --b3: 220 13% 10%;          /* base-300 */
    --bc: 220 13% 91%;          /* base-content */

    --in: 198 93% 60%;          /* info */
    --su: 158 64% 52%;          /* success */
    --wa: 43 96% 56%;           /* warning */
    --er: 0 91% 71%;            /* error */

    --rounded-box: 1rem;
    --rounded-btn: 0.5rem;
    --rounded-badge: 1.9rem;
    --animation-btn: 0.25s;
    --animation-input: 0.2s;
    --btn-text-case: uppercase;
    --btn-focus-scale: 0.95;
    --border-btn: 1px;
    --tab-border: 1px;
    --tab-radius: 0.5rem;
}
```

### Registering a Custom Theme

```jsx
// Register the theme
api.theme.register('my-custom-theme', {
    name: 'My Custom Theme',
    type: 'dark',  // 'light' or 'dark'
    colors: {
        primary: '#7c3aed',
        secondary: '#db2777',
        accent: '#2dd4bf',
        neutral: '#3d4451',
        'base-100': '#1d232a',
        info: '#3abff8',
        success: '#36d399',
        warning: '#fbbd23',
        error: '#f87272'
    }
});

// Now it can be used
api.theme.set('my-custom-theme');
```

---

## Responsive Theme

### System Theme Detection

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

Themes are automatically persisted across sessions:

```jsx
// Theme is saved to localStorage
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

## Component Styling

### Using DaisyUI Components

```jsx
// Buttons
<button class="btn">Default</button>
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-accent">Accent</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-outline">Outline</button>

// Cards
<div class="card bg-base-100 shadow-xl">
    <div class="card-body">
        <h2 class="card-title">Card Title</h2>
        <p>Card content goes here</p>
        <div class="card-actions justify-end">
            <button class="btn btn-primary">Action</button>
        </div>
    </div>
</div>

// Inputs
<input type="text" class="input input-bordered" />
<input type="text" class="input input-primary" />
<textarea class="textarea textarea-bordered"></textarea>
<select class="select select-bordered">
    <option>Option 1</option>
    <option>Option 2</option>
</select>

// Badges
<span class="badge">Default</span>
<span class="badge badge-primary">Primary</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-error">Error</span>

// Alerts
<div class="alert alert-info">Info message</div>
<div class="alert alert-success">Success message</div>
<div class="alert alert-warning">Warning message</div>
<div class="alert alert-error">Error message</div>
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
        api.add({ panel: 'tab', label: 'Themes', icon: IconPalette });
        api.add({ panel: 'viewport', id: 'main', component: ThemeSettings });
    }
});
```
