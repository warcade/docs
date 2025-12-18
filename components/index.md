# Components

WebArcade includes a UI component library built with SolidJS, Tailwind CSS, and DaisyUI.

## Available Components

Components are located in `src/components/ui/`:

### Form Inputs
- Input (text, with `multiline` prop for textarea)
- Select
- Checkbox
- Toggle
- Radio
- Range
- Rating
- FileInput

### Display
- Card
- Badge
- Avatar
- Alert
- Progress
- Skeleton
- Loading
- Tooltip
- Table
- TreeView
- Timeline
- Code

### Navigation
- Tabs
- TabBar
- Breadcrumb
- Pagination
- Steps

### Feedback
- Modal
- Toast
- Drawer
- Popover
- Dropdown

### Layout
- Toolbar
- MenuBar
- Footer
- Divider
- Collapse
- Accordion

### Other
- Carousel
- Countdown
- ButtonGroup
- InputGroup
- SearchBox
- ColorPicker
- EmptyState

## Using Components

Import from the UI library:

```jsx
import { Input, Select, Card, Modal } from '@/components/ui';
```

## Styling

Components use DaisyUI classes and support:
- `variant` - primary, secondary, accent, info, success, warning, error
- `size` - xs, sm, md, lg
- `class` - custom CSS classes

```jsx
<Input variant="primary" size="lg" />
<Card bordered hoverable />
```

## Toast Notifications

```jsx
import { toast } from '@/components/ui';

toast.success('Saved!');
toast.error('Failed');
toast.info('Info');
toast.warning('Warning');
```

::: tip
See the actual component source files in `src/components/ui/` for exact props and usage.
:::
