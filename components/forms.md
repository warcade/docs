# Form Components

Form components for building user input interfaces.

## Input

Text input with various styles and states.

```jsx
import { Input } from '@/components/ui';

// Basic
<Input placeholder="Enter text" />

// With label
<Input label="Username" placeholder="Enter username" />

// Types
<Input type="email" placeholder="Email" />
<Input type="password" placeholder="Password" />
<Input type="number" placeholder="0" />

// Sizes
<Input size="xs" placeholder="Extra small" />
<Input size="sm" placeholder="Small" />
<Input size="md" placeholder="Medium" />
<Input size="lg" placeholder="Large" />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Input label |
| `placeholder` | `string` | - | Placeholder text |
| `type` | `string` | `'text'` | Input type |
| `size` | `'xs'` \| `'sm'` \| `'md'` \| `'lg'` | `'md'` | Input size |
| `error` | `string` \| `boolean` | - | Error state/message |
| `success` | `boolean` | - | Success state |
| `disabled` | `boolean` | - | Disabled state |

### States

```jsx
// Error with message
<Input error="This field is required" />

// Error without message
<Input error />

// Success
<Input success />

// Disabled
<Input disabled value="Can't edit this" />
```

### With Icons

```jsx
import { IconSearch, IconMail } from '@tabler/icons-solidjs';

<Input
    placeholder="Search..."
    icon={<IconSearch size={18} />}
/>

<Input
    type="email"
    placeholder="Email"
    iconRight={<IconMail size={18} />}
/>
```

---

## Select

Dropdown selection component.

```jsx
import { Select } from '@/components/ui';

// Basic
<Select>
    <option>Option 1</option>
    <option>Option 2</option>
    <option>Option 3</option>
</Select>

// With options prop
<Select
    options={['Apple', 'Banana', 'Cherry']}
    placeholder="Select a fruit"
/>

// Object options
<Select
    options={[
        { value: 'us', label: 'United States' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'ca', label: 'Canada' }
    ]}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `string[]` \| `{value, label}[]` | - | Select options |
| `placeholder` | `string` | - | Placeholder option |
| `size` | `'xs'` \| `'sm'` \| `'md'` \| `'lg'` | `'md'` | Select size |
| `disabled` | `boolean` | - | Disabled state |

---

## Checkbox

Checkbox for boolean values.

```jsx
import { Checkbox } from '@/components/ui';

// Basic
<Checkbox label="Accept terms and conditions" />

// Controlled
const [checked, setChecked] = createSignal(false);

<Checkbox
    checked={checked()}
    onChange={setChecked}
    label="Enable notifications"
/>

// Sizes and variants
<Checkbox size="xs" label="Extra small" />
<Checkbox size="lg" label="Large" />
<Checkbox variant="primary" label="Primary color" />
<Checkbox variant="secondary" label="Secondary color" />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Checkbox label |
| `checked` | `boolean` | - | Checked state |
| `onChange` | `(checked: boolean) => void` | - | Change handler |
| `variant` | `'primary'` \| `'secondary'` \| `'accent'` | - | Color variant |
| `size` | `'xs'` \| `'sm'` \| `'md'` \| `'lg'` | `'md'` | Checkbox size |
| `disabled` | `boolean` | - | Disabled state |

---

## Radio

Radio buttons for single selection from multiple options.

```jsx
import { Radio, RadioGroup } from '@/components/ui';

// Basic group
<RadioGroup name="size" value={selected()} onChange={setSelected}>
    <Radio value="s" label="Small" />
    <Radio value="m" label="Medium" />
    <Radio value="l" label="Large" />
</RadioGroup>

// Horizontal layout
<RadioGroup name="plan" horizontal>
    <Radio value="free" label="Free" />
    <Radio value="pro" label="Pro" />
    <Radio value="enterprise" label="Enterprise" />
</RadioGroup>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | **required** | Radio value |
| `label` | `string` | - | Radio label |
| `variant` | `'primary'` \| `'secondary'` \| `'accent'` | - | Color variant |
| `disabled` | `boolean` | - | Disabled state |

---

## Toggle

Toggle switch for on/off states.

```jsx
import { Toggle } from '@/components/ui';

// Basic
<Toggle label="Enable dark mode" />

// Controlled
const [enabled, setEnabled] = createSignal(false);

<Toggle
    checked={enabled()}
    onChange={setEnabled}
    label="Notifications"
/>

// Variants
<Toggle variant="primary" label="Primary" />
<Toggle variant="secondary" label="Secondary" />
<Toggle variant="success" label="Success" />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Toggle label |
| `checked` | `boolean` | - | Checked state |
| `onChange` | `(checked: boolean) => void` | - | Change handler |
| `variant` | `'primary'` \| `'secondary'` \| `'accent'` \| `'success'` | - | Color variant |
| `size` | `'xs'` \| `'sm'` \| `'md'` \| `'lg'` | `'md'` | Toggle size |
| `disabled` | `boolean` | - | Disabled state |

---

## Range

Slider for numeric range selection.

```jsx
import { Range } from '@/components/ui';

// Basic
<Range min={0} max={100} />

// Controlled
const [volume, setVolume] = createSignal(50);

<Range
    min={0}
    max={100}
    value={volume()}
    onChange={setVolume}
/>

// With step
<Range min={0} max={100} step={10} />

// Variants
<Range variant="primary" />
<Range variant="secondary" />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Step increment |
| `value` | `number` | - | Current value |
| `onChange` | `(value: number) => void` | - | Change handler |
| `variant` | `'primary'` \| `'secondary'` \| `'accent'` | - | Color variant |

---

## FileInput

File upload input.

```jsx
import { FileInput } from '@/components/ui';

// Basic
<FileInput />

// With accept filter
<FileInput accept="image/*" />

// Multiple files
<FileInput multiple />

// Styled
<FileInput variant="primary" />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `accept` | `string` | - | Accepted file types |
| `multiple` | `boolean` | - | Allow multiple files |
| `onChange` | `(files: FileList) => void` | - | Change handler |
| `variant` | `'primary'` \| `'secondary'` \| `'accent'` | - | Color variant |

---

## Textarea

Multi-line text input.

```jsx
import { Textarea } from '@/components/ui';

// Basic
<Textarea placeholder="Enter description" />

// With rows
<Textarea rows={6} placeholder="Long text..." />

// States
<Textarea error="Required field" />
<Textarea disabled />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | - | Placeholder text |
| `rows` | `number` | `3` | Number of rows |
| `error` | `string` \| `boolean` | - | Error state/message |
| `disabled` | `boolean` | - | Disabled state |

---

## Form Example

Complete form with validation:

```jsx
import { Input, Select, Checkbox, Button, Alert } from '@/components/ui';
import { createSignal } from 'solid-js';

function RegistrationForm() {
    const [form, setForm] = createSignal({
        name: '',
        email: '',
        country: '',
        terms: false
    });
    const [errors, setErrors] = createSignal({});

    const validate = () => {
        const errs = {};
        if (!form().name) errs.name = 'Name is required';
        if (!form().email.includes('@')) errs.email = 'Invalid email';
        if (!form().country) errs.country = 'Select a country';
        if (!form().terms) errs.terms = 'Must accept terms';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // Submit form
            console.log('Form submitted:', form());
        }
    };

    return (
        <form onSubmit={handleSubmit} class="space-y-4 max-w-md">
            <Input
                label="Full Name"
                value={form().name}
                onInput={(e) => setForm(f => ({...f, name: e.target.value}))}
                error={errors().name}
            />

            <Input
                type="email"
                label="Email"
                value={form().email}
                onInput={(e) => setForm(f => ({...f, email: e.target.value}))}
                error={errors().email}
            />

            <Select
                label="Country"
                placeholder="Select country"
                options={['United States', 'Canada', 'United Kingdom']}
                value={form().country}
                onChange={(v) => setForm(f => ({...f, country: v}))}
                error={errors().country}
            />

            <Checkbox
                label="I accept the terms and conditions"
                checked={form().terms}
                onChange={(v) => setForm(f => ({...f, terms: v}))}
            />
            <Show when={errors().terms}>
                <span class="text-error text-sm">{errors().terms}</span>
            </Show>

            <Button type="submit" variant="primary" class="w-full">
                Register
            </Button>
        </form>
    );
}
```
