# Layout Primitives

WebArcade provides low-level layout primitives for building custom layouts.

## Row

A horizontal flex container.

```jsx
import { Row } from '@/components/layout';

<Row>
    <div>Left</div>
    <div>Center</div>
    <div>Right</div>
</Row>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gap` | `string` | `'0'` | Gap between children (Tailwind spacing) |
| `align` | `string` | `'stretch'` | Align items: `start`, `center`, `end`, `stretch` |
| `justify` | `string` | `'start'` | Justify content: `start`, `center`, `end`, `between`, `around` |
| `wrap` | `boolean` | `false` | Allow wrapping |
| `class` | `string` | - | Additional CSS classes |

### Examples

```jsx
// Centered row with gap
<Row align="center" justify="center" gap="4">
    <Button>One</Button>
    <Button>Two</Button>
    <Button>Three</Button>
</Row>

// Space between items
<Row justify="between">
    <Logo />
    <Navigation />
    <UserMenu />
</Row>

// Wrapping row
<Row wrap gap="2">
    <For each={tags}>
        {(tag) => <Badge>{tag}</Badge>}
    </For>
</Row>
```

---

## Column

A vertical flex container.

```jsx
import { Column } from '@/components/layout';

<Column>
    <Header />
    <Main />
    <Footer />
</Column>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gap` | `string` | `'0'` | Gap between children |
| `align` | `string` | `'stretch'` | Align items |
| `justify` | `string` | `'start'` | Justify content |
| `class` | `string` | - | Additional CSS classes |

### Examples

```jsx
// Sidebar with sections
<Column gap="4" class="h-full">
    <SearchBox />
    <FileTree />
    <Spacer />
    <StatusInfo />
</Column>

// Centered content
<Column align="center" justify="center" class="h-screen">
    <Logo />
    <h1>Welcome</h1>
    <Button>Get Started</Button>
</Column>
```

---

## Slot

Renders registered components as tabs.

```jsx
import { Slot } from '@/components/layout';

<Slot name="viewport" />
```

When plugins register panels to a slot, they appear as tabs:

```jsx
// Plugin A
api.register('editor', {
    type: 'panel',
    slot: 'viewport',
    component: Editor,
    label: 'Editor'
});

// Plugin B
api.register('preview', {
    type: 'panel',
    slot: 'viewport',
    component: Preview,
    label: 'Preview'
});

// The Slot will render both as tabs
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | **required** | Slot identifier |
| `fallback` | `JSX.Element` | - | Content when no panels registered |
| `single` | `boolean` | `false` | Only show one panel (no tabs) |
| `class` | `string` | - | Additional CSS classes |

### Examples

```jsx
// With fallback content
<Slot
    name="left"
    fallback={<div class="p-4 text-gray-500">No panels</div>}
/>

// Single panel mode (no tabs)
<Slot name="main" single />

// Custom styling
<Slot name="viewport" class="flex-1 overflow-hidden" />
```

---

## Spacer

Fills available space in a Row or Column.

```jsx
import { Spacer } from '@/components/layout';

<Row>
    <Logo />
    <Spacer />  {/* Pushes UserMenu to the right */}
    <UserMenu />
</Row>
```

Useful for:
- Pushing items to opposite ends
- Creating flexible spacing
- Centering with unequal siblings

---

## Resizable

A container with drag handles for user resizing.

```jsx
import { Resizable } from '@/components/layout';

<Resizable
    direction="horizontal"
    initialSize={250}
    minSize={150}
    maxSize={400}
>
    <Sidebar />
</Resizable>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `'horizontal'` \| `'vertical'` | `'horizontal'` | Resize direction |
| `initialSize` | `number` | `200` | Initial size in pixels |
| `minSize` | `number` | `100` | Minimum size |
| `maxSize` | `number` | `500` | Maximum size |
| `handlePosition` | `'start'` \| `'end'` | `'end'` | Where to place the drag handle |
| `onResize` | `(size: number) => void` | - | Called during resize |
| `onResizeEnd` | `(size: number) => void` | - | Called when resize ends |

### Examples

```jsx
// Left sidebar with right handle
<Resizable
    direction="horizontal"
    initialSize={250}
    minSize={200}
    maxSize={400}
    handlePosition="end"
>
    <LeftSidebar />
</Resizable>

// Bottom panel with top handle
<Resizable
    direction="vertical"
    initialSize={200}
    minSize={100}
    maxSize={500}
    handlePosition="start"
>
    <BottomPanel />
</Resizable>

// With resize callbacks
<Resizable
    direction="horizontal"
    initialSize={300}
    onResize={(size) => console.log('Resizing:', size)}
    onResizeEnd={(size) => savePreference('sidebar-width', size)}
>
    <Sidebar />
</Resizable>
```

---

## Combining Primitives

Build complex layouts by composing primitives:

```jsx
function AppLayout() {
    return (
        <Column class="h-screen">
            {/* Menu bar */}
            <Slot name="menu" />

            {/* Toolbar */}
            <Slot name="toolbar" />

            {/* Main content area */}
            <Row class="flex-1 overflow-hidden">
                {/* Left sidebar */}
                <Resizable direction="horizontal" initialSize={250}>
                    <Slot name="left" />
                </Resizable>

                {/* Center + bottom */}
                <Column class="flex-1">
                    <Slot name="viewport" class="flex-1" />

                    <Resizable direction="vertical" initialSize={200} handlePosition="start">
                        <Slot name="bottom" />
                    </Resizable>
                </Column>

                {/* Right sidebar */}
                <Resizable direction="horizontal" initialSize={300} handlePosition="start">
                    <Slot name="right" />
                </Resizable>
            </Row>

            {/* Status bar */}
            <Slot name="status" />
        </Column>
    );
}
```

This creates the standard IDE-like layout with resizable sidebars and panels.
