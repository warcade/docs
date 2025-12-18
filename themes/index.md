# Themes

WebArcade uses DaisyUI for theming, providing 30+ built-in themes and support for custom themes.

## Overview

Themes control the entire look and feel of your application:

- **Colors** - Primary, secondary, accent, and semantic colors
- **Typography** - Text colors and contrast
- **Components** - Button styles, card shadows, input borders
- **Transitions** - Animation speeds

Switching themes updates everything instantly with no page reload.

## Quick Start

```jsx
// Set theme programmatically
api.theme.set('dracula');

// Get current theme
const current = api.theme.get();

// Check if dark theme
if (api.theme.isDark()) {
    // Dark mode specific logic
}

// Follow system preference
api.theme.setAuto();
```

## Built-in Themes

### Light Themes

| Theme | Description |
|-------|-------------|
| `light` | Default light theme |
| `cupcake` | Soft pink and purple |
| `bumblebee` | Yellow and black |
| `emerald` | Green focused |
| `corporate` | Professional blue |
| `garden` | Nature inspired |
| `lofi` | Low contrast light |
| `pastel` | Soft pastel colors |
| `fantasy` | Purple and pink |
| `wireframe` | Minimal wireframe style |
| `cmyk` | Print-inspired colors |
| `autumn` | Warm fall colors |
| `acid` | Bright neon colors |
| `lemonade` | Fresh citrus colors |
| `winter` | Cool winter tones |

### Dark Themes

| Theme | Description |
|-------|-------------|
| `dark` | Default dark theme |
| `synthwave` | Retro 80s neon |
| `halloween` | Orange and purple |
| `forest` | Dark green |
| `aqua` | Teal and cyan |
| `black` | Pure black |
| `luxury` | Gold and black |
| `dracula` | Popular dark theme |
| `business` | Professional dark |
| `night` | Deep blue night |
| `coffee` | Brown tones |
| `dim` | Subtle dark |
| `nord` | Nordic color palette |
| `sunset` | Warm sunset colors |

## Theme Sections

### [Using Themes](./using-themes)
Set, switch, and detect themes in your plugins.

### [Theme Colors](./colors)
Understanding semantic colors and how to use them.
