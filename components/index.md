# Components

WebArcade includes a comprehensive UI component library built with SolidJS, Tailwind CSS, and DaisyUI. These components are designed to work seamlessly with the theme system.

## Overview

Components are organized into categories:

| Category | Components |
|----------|------------|
| **Layout** | Row, Column, Spacer, Card, Divider |
| **Form** | Input, Select, Checkbox, Radio, Toggle, Range, FileInput |
| **Display** | Badge, Alert, Avatar, Progress, Skeleton, Loading |
| **Navigation** | Tabs, Breadcrumb, Pagination, Accordion |
| **Feedback** | Toast, Modal, Popover, Tooltip, Drawer |
| **Data** | Table, TreeView, Timeline, Code |
| **Advanced** | ColorPicker, Rating, Countdown, SearchBox |

## Quick Start

Import components from the UI library:

```jsx
import { Button, Card, Input, Select } from '@/components/ui';

function MyPanel() {
    return (
        <Card>
            <h2>User Form</h2>
            <Input placeholder="Enter name" />
            <Select options={['Option 1', 'Option 2']} />
            <Button variant="primary">Submit</Button>
        </Card>
    );
}
```

## Component Sections

### [Forms](./forms)
Input, Select, Checkbox, Radio, Toggle, Range, and more.

---

## Using DaisyUI Classes

All components support DaisyUI's utility classes:

### Variants

```jsx
<Button>Default</Button>
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="accent">Accent</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="outline">Outline</Button>
```

### Sizes

```jsx
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### States

```jsx
<Button disabled>Disabled</Button>
<Button loading>Loading</Button>
<Input error="This field is required" />
<Input success />
```

---

## Icons

WebArcade uses [Tabler Icons](https://tabler.io/icons):

```jsx
import { IconHome, IconSettings, IconUser } from '@tabler/icons-solidjs';

<Button>
    <IconHome size={18} />
    Home
</Button>

<IconSettings size={24} class="text-primary" />
```

### Icon Sizes

| Use Case | Size |
|----------|------|
| Inline with text | 16-18 |
| Buttons | 18-20 |
| Standalone | 24 |
| Large display | 32+ |

---

## Common Patterns

### Form with Validation

```jsx
import { Input, Button, Alert } from '@/components/ui';
import { createSignal } from 'solid-js';

function LoginForm() {
    const [email, setEmail] = createSignal('');
    const [error, setError] = createSignal('');

    const handleSubmit = () => {
        if (!email().includes('@')) {
            setError('Invalid email address');
            return;
        }
        setError('');
        // Submit form
    };

    return (
        <div class="space-y-4">
            <Show when={error()}>
                <Alert variant="error">{error()}</Alert>
            </Show>

            <Input
                type="email"
                placeholder="Email"
                value={email()}
                onInput={(e) => setEmail(e.target.value)}
                error={error() ? true : false}
            />

            <Button variant="primary" onClick={handleSubmit}>
                Login
            </Button>
        </div>
    );
}
```

### Card Layout

```jsx
import { Card, Badge, Button } from '@/components/ui';

function ProductCard({ product }) {
    return (
        <Card>
            <Card.Image src={product.image} alt={product.name} />
            <Card.Body>
                <Card.Title>
                    {product.name}
                    <Badge variant="secondary">{product.category}</Badge>
                </Card.Title>
                <p>{product.description}</p>
                <Card.Actions>
                    <Button variant="primary">Buy Now</Button>
                </Card.Actions>
            </Card.Body>
        </Card>
    );
}
```

### Modal Dialog

```jsx
import { Modal, Button } from '@/components/ui';
import { createSignal } from 'solid-js';

function DeleteConfirmation() {
    const [open, setOpen] = createSignal(false);

    const handleDelete = () => {
        // Perform delete
        setOpen(false);
    };

    return (
        <>
            <Button variant="error" onClick={() => setOpen(true)}>
                Delete
            </Button>

            <Modal open={open()} onClose={() => setOpen(false)}>
                <Modal.Header>Confirm Delete</Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this item?
                </Modal.Body>
                <Modal.Actions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="error" onClick={handleDelete}>Delete</Button>
                </Modal.Actions>
            </Modal>
        </>
    );
}
```

### Toast Notifications

```jsx
import { toast } from '@/components/ui';

// Show different toast types
toast.success('File saved successfully');
toast.error('Failed to save file');
toast.info('New update available');
toast.warning('Unsaved changes');

// With options
toast.success('Saved!', {
    duration: 5000,
    position: 'top-right'
});
```

---

## Theming Components

Components automatically adapt to the current theme:

```jsx
// These buttons will look different in light vs dark themes
<Button variant="primary">Primary</Button>
<Card class="bg-base-200">
    <p class="text-base-content">Themed content</p>
</Card>
```

### Custom Styling

Override styles with Tailwind classes:

```jsx
<Button class="rounded-full px-8">Pill Button</Button>
<Card class="border-2 border-primary">Bordered Card</Card>
<Input class="font-mono" placeholder="Code input" />
```

---

## Accessibility

Components include accessibility features:

- Keyboard navigation
- ARIA attributes
- Focus management
- Screen reader support

```jsx
// Labels are properly associated
<Input id="email" label="Email Address" />

// Buttons have proper roles
<Button role="menuitem">Menu Item</Button>

// Modals trap focus
<Modal open={open()} aria-labelledby="modal-title">
    <h2 id="modal-title">Title</h2>
</Modal>
```
