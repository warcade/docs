# Layouts

The layout system is how you structure your WebArcade application. It provides a flexible way to arrange panels, toolbars, menus, and status bars.

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Menu Bar                                                   │
├─────────────────────────────────────────────────────────────┤
│  Toolbar                                                    │
├──────────┬─────────────────────────────┬────────────────────┤
│          │                             │                    │
│  Left    │       Main Viewport         │      Right         │
│  Panel   │                             │      Panel         │
│          │     (Tabs from plugins)     │                    │
│          │                             │                    │
│          ├─────────────────────────────┤                    │
│          │     Bottom Panel            │                    │
├──────────┴─────────────────────────────┴────────────────────┤
│  Status Bar                                                 │
└─────────────────────────────────────────────────────────────┘
```

## Registering Panels

Plugins register panels to appear in slots:

```jsx
export default plugin({
    id: 'my-plugin',
    name: 'My Plugin',
    version: '1.0.0',

    start(api) {
        api.register('my-panel', {
            type: 'panel',
            slot: 'viewport',
            component: MyPanel,
            label: 'My Panel'
        });
    }
});
```

## Slots

The default layout includes these slots:

| Slot | Location |
|------|----------|
| `left` | Left sidebar |
| `right` | Right sidebar |
| `viewport` | Main content area |
| `bottom` | Bottom panel |
| `toolbar` | Top toolbar |
| `menu` | Menu bar |
| `status` | Status bar |

## Toolbar Items

```jsx
api.register('save-button', {
    type: 'toolbar',
    component: SaveButton,
    position: 'left'  // 'left', 'center', or 'right'
});
```

## Status Bar Items

```jsx
api.register('line-count', {
    type: 'status',
    component: LineCounter,
    position: 'right'
});
```

## Layout Manager

Switch between layouts programmatically:

```jsx
// In your plugin
api.layout.setActive('compact');
api.layout.back();
api.layout.canGoBack();
api.layout.getActiveId();
api.layout.getAll();
```
