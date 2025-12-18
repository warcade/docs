# Theme Colors

DaisyUI themes provide semantic color classes that automatically adapt to the current theme.

## Primary Colors

| Class | Description |
|-------|-------------|
| `primary` | Main brand color |
| `primary-focus` | Darker primary for focus/hover |
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

## Base Colors

| Class | Description |
|-------|-------------|
| `base-100` | Main background |
| `base-200` | Slightly darker background |
| `base-300` | Even darker background |
| `base-content` | Default text color |

## Status Colors

| Class | Description |
|-------|-------------|
| `info` | Information (blue) |
| `info-content` | Text on info background |
| `success` | Success (green) |
| `success-content` | Text on success background |
| `warning` | Warning (yellow) |
| `warning-content` | Text on warning background |
| `error` | Error (red) |
| `error-content` | Text on error background |

---

## Using Colors

### Text Colors

```jsx
<span class="text-primary">Primary text</span>
<span class="text-secondary">Secondary text</span>
<span class="text-accent">Accent text</span>
<span class="text-base-content">Default text</span>
<span class="text-success">Success text</span>
<span class="text-error">Error text</span>
```

### Background Colors

```jsx
<div class="bg-base-100">Main background</div>
<div class="bg-base-200">Card background</div>
<div class="bg-base-300">Darker section</div>

<div class="bg-primary text-primary-content">Primary section</div>
<div class="bg-secondary text-secondary-content">Secondary section</div>
```

### Border Colors

```jsx
<div class="border border-base-300">Default border</div>
<div class="border border-primary">Primary border</div>
<div class="border border-error">Error border</div>
```

---

## Component Examples

### Buttons

```jsx
<button class="btn">Default</button>
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-accent">Accent</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-outline">Outline</button>
```

### Cards

```jsx
<div class="card bg-base-100 shadow-xl">
    <div class="card-body">
        <h2 class="card-title">Card Title</h2>
        <p>Card content goes here</p>
        <div class="card-actions justify-end">
            <button class="btn btn-primary">Action</button>
        </div>
    </div>
</div>
```

### Inputs

```jsx
<input type="text" class="input input-bordered" />
<input type="text" class="input input-primary" />
<textarea class="textarea textarea-bordered"></textarea>
<select class="select select-bordered">
    <option>Option 1</option>
    <option>Option 2</option>
</select>
```

### Badges

```jsx
<span class="badge">Default</span>
<span class="badge badge-primary">Primary</span>
<span class="badge badge-secondary">Secondary</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-error">Error</span>
```

### Alerts

```jsx
<div class="alert alert-info">Info message</div>
<div class="alert alert-success">Success message</div>
<div class="alert alert-warning">Warning message</div>
<div class="alert alert-error">Error message</div>
```

---

## Opacity Variants

Use opacity modifiers for subtle colors:

```jsx
<div class="bg-primary/10">10% primary background</div>
<div class="bg-primary/25">25% primary background</div>
<div class="bg-primary/50">50% primary background</div>
<div class="text-base-content/50">50% opacity text</div>
<div class="border border-base-content/20">Subtle border</div>
```

---

## Reading Theme Colors in JavaScript

Access computed theme colors:

```jsx
function getThemeColors() {
    const style = getComputedStyle(document.documentElement);

    return {
        primary: `hsl(${style.getPropertyValue('--p')})`,
        secondary: `hsl(${style.getPropertyValue('--s')})`,
        accent: `hsl(${style.getPropertyValue('--a')})`,
        neutral: `hsl(${style.getPropertyValue('--n')})`,
        base100: `hsl(${style.getPropertyValue('--b1')})`,
        info: `hsl(${style.getPropertyValue('--in')})`,
        success: `hsl(${style.getPropertyValue('--su')})`,
        warning: `hsl(${style.getPropertyValue('--wa')})`,
        error: `hsl(${style.getPropertyValue('--er')})`
    };
}
```

### Using with Charts

```jsx
import Chart from 'chart.js';

function createChart(canvas) {
    const colors = getThemeColors();

    return new Chart(canvas, {
        type: 'bar',
        data: {
            labels: ['A', 'B', 'C'],
            datasets: [{
                data: [10, 20, 30],
                backgroundColor: [
                    colors.primary,
                    colors.secondary,
                    colors.accent
                ]
            }]
        }
    });
}
```

---

## Color Combinations

### Good Combinations

```jsx
// Primary button with correct text color
<button class="btn bg-primary text-primary-content">Button</button>

// Card with proper layering
<div class="bg-base-100">
    <div class="bg-base-200 p-4">
        <div class="bg-base-300 p-2">Nested</div>
    </div>
</div>

// Status with correct contrast
<div class="bg-success text-success-content p-4">
    Success message with proper text color
</div>
```

### Contrast Tips

1. Use `-content` variants for text on colored backgrounds
2. Use `base-200` and `base-300` for depth layering
3. Use opacity variants for subtle effects
4. Test in both light and dark themes
