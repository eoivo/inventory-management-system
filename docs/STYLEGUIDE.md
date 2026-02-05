# UI Style Guide - Inventory Management System

## Design Philosophy

**Core Principles:**
- **Professional:** Clean, business-appropriate aesthetic
- **Functional:** Form follows function, no decorative elements
- **Consistent:** Predictable patterns across all interfaces
- **Accessible:** WCAG 2.1 Level AA compliance
- **Responsive:** Mobile-first, works on all devices

### NO EMOJIS Policy

**IMPORTANT:** This is a professional business application for industrial inventory management.

**❌ NEVER USE:**
- Emojis (😀, 🚀, ✨, etc.)
- Decorative Unicode symbols
- Emoticons

**✅ ALWAYS USE:**
- **Lucide React Icons** for all visual indicators
- Professional, consistent icon system
- Semantic, meaningful icons that convey clear purpose

**Rationale:**
- Emojis appear unprofessional in business software
- Inconsistent rendering across devices/platforms
- Poor accessibility for screen readers
- Not suitable for ERP/industrial systems
- Icons provide better semantic meaning

**Example - Wrong vs Right:**

```typescript
// ❌ WRONG - Using emojis
<button>Add Product 🎉</button>
<div>Success! ✨</div>

// ✅ CORRECT - Using Lucide React icons
import { Plus, CheckCircle } from 'lucide-react';

<button>
  <Plus size={16} />
  <span>Add Product</span>
</button>

<div>
  <CheckCircle size={20} />
  <span>Success!</span>
</div>
```

---

## Color Palette

### Primary Colors

```css
/* Primary - Brand Color */
--primary: 222.2 47.4% 11.2%;      /* Dark slate - main brand */
--primary-foreground: 210 40% 98%; /* Off-white text on primary */

/* Secondary - Accent Color */
--secondary: 210 40% 96.1%;        /* Light gray background */
--secondary-foreground: 222.2 47.4% 11.2%; /* Dark text */
```

### Semantic Colors

```css
/* Success - Positive Actions */
--success: 142 76% 36%;            /* Green */
--success-foreground: 355 100% 97%; /* Light text */

/* Destructive - Dangerous Actions */
--destructive: 0 84.2% 60.2%;      /* Red */
--destructive-foreground: 210 40% 98%; /* Light text */

/* Warning - Caution */
--warning: 38 92% 50%;             /* Amber */
--warning-foreground: 48 96% 89%;  /* Light text */

/* Info - Informational */
--info: 221 83% 53%;               /* Blue */
--info-foreground: 210 40% 98%;    /* Light text */
```

### Neutral Colors

```css
/* Background */
--background: 0 0% 100%;           /* Pure white */
--foreground: 222.2 84% 4.9%;      /* Almost black text */

/* Card/Surface */
--card: 0 0% 100%;                 /* White */
--card-foreground: 222.2 84% 4.9%; /* Dark text */

/* Muted - Subtle elements */
--muted: 210 40% 96.1%;            /* Very light gray */
--muted-foreground: 215.4 16.3% 46.9%; /* Medium gray text */

/* Accent - Hover states */
--accent: 210 40% 96.1%;           /* Light gray */
--accent-foreground: 222.2 47.4% 11.2%; /* Dark text */

/* Border */
--border: 214.3 31.8% 91.4%;       /* Light gray border */
--input: 214.3 31.8% 91.4%;        /* Input border */

/* Ring - Focus indicator */
--ring: 222.2 84% 4.9%;            /* Dark focus ring */
```

---

## Typography

### Font Family

```css
/* Sans-serif - Primary (Inter recommended) */
font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", 
             Roboto, "Helvetica Neue", Arial, sans-serif;

/* Monospace - Codes, Numbers */
font-family: "JetBrains Mono", "SF Mono", "Monaco", "Inconsolata", 
             "Roboto Mono", "Courier New", monospace;
```

**Font Choice Rationale:**

**Primary Font: Inter**
- Specifically designed for digital interfaces and screens
- Excellent legibility at small sizes (critical for data tables)
- Tabular figures (numbers align vertically in tables)
- Professional appearance suitable for business applications
- Open-source and free
- Used by: GitHub, Vercel, Figma, many enterprise dashboards

**Installation:**
```html
<!-- In index.html or layout -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

**Alternative Options:**
- **IBM Plex Sans:** More corporate, excellent for enterprise systems
- **System Fonts:** Best performance (zero download), familiar to users
- **Avoid:** Poppins (too trendy), Comic Sans (unprofessional), decorative fonts

**Monospace Font: JetBrains Mono**
- Designed specifically for code and technical content
- Excellent distinction between similar characters (0 vs O, 1 vs l)
- Perfect for product codes, IDs, technical identifiers

### Font Sizes

```css
/* Headings */
--text-4xl: 2.25rem;   /* 36px - Page titles */
--text-3xl: 1.875rem;  /* 30px - Section titles */
--text-2xl: 1.5rem;    /* 24px - Card titles */
--text-xl: 1.25rem;    /* 20px - Subsections */
--text-lg: 1.125rem;   /* 18px - Large body */

/* Body */
--text-base: 1rem;     /* 16px - Default body text */
--text-sm: 0.875rem;   /* 14px - Small labels */
--text-xs: 0.75rem;    /* 12px - Captions, helper text */
```

### Font Weights

```css
--font-light: 300;     /* Rare, subtle text */
--font-normal: 400;    /* Body text, default */
--font-medium: 500;    /* Emphasis, labels */
--font-semibold: 600;  /* Subheadings */
--font-bold: 700;      /* Headings, strong emphasis */
```

### Line Heights

```css
--leading-none: 1;      /* Tight, for headings */
--leading-tight: 1.25;  /* Headings */
--leading-snug: 1.375;  /* Compact lists */
--leading-normal: 1.5;  /* Body text, default */
--leading-relaxed: 1.625; /* Readable paragraphs */
--leading-loose: 2;     /* Very spacious */
```

---

## Spacing System

### Scale (Based on 4px unit)

```css
--spacing-0: 0;          /* 0px */
--spacing-1: 0.25rem;    /* 4px */
--spacing-2: 0.5rem;     /* 8px */
--spacing-3: 0.75rem;    /* 12px */
--spacing-4: 1rem;       /* 16px - base unit */
--spacing-5: 1.25rem;    /* 20px */
--spacing-6: 1.5rem;     /* 24px */
--spacing-8: 2rem;       /* 32px */
--spacing-10: 2.5rem;    /* 40px */
--spacing-12: 3rem;      /* 48px */
--spacing-16: 4rem;      /* 64px */
--spacing-20: 5rem;      /* 80px */
--spacing-24: 6rem;      /* 96px */
```

### Usage Guidelines

**Component Spacing:**
- Padding inside cards: `spacing-4` to `spacing-6`
- Gap between form fields: `spacing-4`
- Gap between cards: `spacing-4` to `spacing-6`
- Section margins: `spacing-8` to `spacing-12`

---

## Component Specifications

### 1. Buttons

#### Primary Button
```css
.button-primary {
  background: var(--primary);
  color: var(--primary-foreground);
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 150ms ease;
}

.button-primary:hover {
  opacity: 0.9;
}

.button-primary:active {
  opacity: 0.8;
}
```

**Usage:** Main actions (Save, Create, Submit)

#### Secondary Button
```css
.button-secondary {
  background: var(--secondary);
  color: var(--secondary-foreground);
  border: 1px solid var(--border);
}
```

**Usage:** Alternative actions (Cancel, Reset)

#### Destructive Button
```css
.button-destructive {
  background: var(--destructive);
  color: var(--destructive-foreground);
}
```

**Usage:** Delete, Remove actions

#### Sizes
- **Small:** `padding: 0.25rem 0.75rem; font-size: 0.875rem;`
- **Default:** `padding: 0.5rem 1rem; font-size: 1rem;`
- **Large:** `padding: 0.75rem 1.5rem; font-size: 1.125rem;`

---

### 2. Form Elements

#### Input Fields
```css
.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--input);
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 150ms;
}

.input:focus {
  outline: none;
  border-color: var(--ring);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
}

.input:disabled {
  background: var(--muted);
  cursor: not-allowed;
  opacity: 0.6;
}
```

#### Labels
```css
.label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--foreground);
}
```

#### Error State
```css
.input-error {
  border-color: var(--destructive);
}

.error-message {
  color: var(--destructive);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
```

#### Helper Text
```css
.helper-text {
  color: var(--muted-foreground);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
```

---

### 3. Cards

#### Standard Card
```css
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-header {
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--card-foreground);
}

.card-description {
  font-size: 0.875rem;
  color: var(--muted-foreground);
  margin-top: 0.25rem;
}

.card-content {
  /* Main content area */
}

.card-footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}
```

---

### 4. Tables

#### Table Structure
```css
.table {
  width: 100%;
  border-collapse: collapse;
}

.table-header {
  background: var(--muted);
}

.table-header-cell {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--foreground);
  border-bottom: 2px solid var(--border);
}

.table-row {
  border-bottom: 1px solid var(--border);
  transition: background-color 150ms;
}

.table-row:hover {
  background: var(--muted);
}

.table-cell {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: var(--foreground);
}
```

#### Responsive Table
- On mobile: Consider card-based layout instead of horizontal scrolling
- Use `overflow-x: auto` for horizontal scroll if needed

---

### 5. Modals/Dialogs

#### Dialog Container
```css
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.dialog-content {
  background: var(--background);
  border-radius: 0.5rem;
  padding: 1.5rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.dialog-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.dialog-description {
  font-size: 0.875rem;
  color: var(--muted-foreground);
  margin-bottom: 1.5rem;
}

.dialog-footer {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}
```

---

### 6. Loading States

#### Spinner
```css
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--muted);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

#### Skeleton Loader
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--muted) 0%,
    var(--accent) 50%,
    var(--muted) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 0.25rem;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

### 7. Badges

#### Status Badges
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-success {
  background: var(--success);
  color: var(--success-foreground);
}

.badge-warning {
  background: var(--warning);
  color: var(--warning-foreground);
}

.badge-destructive {
  background: var(--destructive);
  color: var(--destructive-foreground);
}

.badge-secondary {
  background: var(--secondary);
  color: var(--secondary-foreground);
}
```

---

### 8. Toast Notifications

#### Toast Container
```css
.toast {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 0.75rem;
  max-width: 400px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-success {
  border-left: 4px solid var(--success);
}

.toast-error {
  border-left: 4px solid var(--destructive);
}

.toast-warning {
  border-left: 4px solid var(--warning);
}

.toast-info {
  border-left: 4px solid var(--info);
}
```

---

## Layout Patterns

### Page Container
```css
.page-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

@media (min-width: 768px) {
  .page-container {
    padding: 2rem 2rem;
  }
}
```

### Grid Layouts

#### Two-Column Form
```css
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }
}
```

#### Card Grid
```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
```

---

## Responsive Breakpoints

```css
/* Mobile First Approach */

/* Small devices (phones) */
/* Default: 0px - 640px */

/* Medium devices (tablets) */
@media (min-width: 768px) { /* md */ }

/* Large devices (desktops) */
@media (min-width: 1024px) { /* lg */ }

/* Extra large devices */
@media (min-width: 1280px) { /* xl */ }

/* 2XL devices */
@media (min-width: 1536px) { /* 2xl */ }
```

---

## Icons

### Icon System

**NO EMOJIS - Use Lucide React Icons Instead**

This is a professional business application. Instead of emojis, use the Lucide React icon library for all visual indicators.

**Library:** Lucide React  
**Website:** https://lucide.dev/  
**Installation:** `npm install lucide-react`

**Why Lucide React:**
- Consistent, professional design
- Fully customizable (size, color, stroke)
- Tree-shakeable (only import what you use)
- TypeScript support
- Accessible (proper ARIA labels)
- Open-source

### Icon Sizes

```typescript
// Small - For inline text, compact buttons
<Plus size={16} />

// Default - Most common use case
<Edit size={20} />

// Large - Page headers, empty states
<Package size={24} />

// Extra Large - Hero sections, feature highlights
<TrendingUp size={32} />
```

### Icon Colors

Icons should inherit color from parent or use semantic colors:

```typescript
// Inherit from parent text color (default)
<Check />

// Semantic colors via className
<Check className="text-green-600" />
<AlertCircle className="text-red-600" />
<Info className="text-blue-600" />
```

### Common Icons Mapping

| Action | Icon Component | Usage |
|--------|---------------|--------|
| Add/Create | `<Plus />` | Create new items, add to list |
| Edit/Modify | `<Pencil />` or `<Edit />` | Edit forms, modify data |
| Delete/Remove | `<Trash2 />` | Delete items, remove associations |
| Save | `<Check />` or `<Save />` | Save forms, confirm actions |
| Cancel | `<X />` | Close modals, cancel operations |
| Search | `<Search />` | Search bars, filter inputs |
| Filter | `<Filter />` | Filter dropdowns |
| Sort | `<ArrowUpDown />` | Sortable table headers |
| View/Details | `<Eye />` | View details, preview |
| Download | `<Download />` | Export, download reports |
| Upload | `<Upload />` | Import, file uploads |
| Refresh | `<RefreshCw />` | Reload data, sync |
| Settings | `<Settings />` | Configuration, preferences |
| Info | `<Info />` | Tooltips, help text |
| Warning | `<AlertTriangle />` | Warnings, cautions |
| Error | `<AlertCircle />` | Error messages |
| Success | `<CheckCircle />` | Success messages |
| Loading | `<Loader2 />` | Loading indicators (with spin animation) |
| Menu | `<Menu />` | Mobile menu, navigation |
| Back | `<ChevronLeft />` | Navigation back |
| Forward | `<ChevronRight />` | Navigation forward |
| Up | `<ChevronUp />` | Collapse, scroll up |
| Down | `<ChevronDown />` | Expand, scroll down |

### Domain-Specific Icons

For the Inventory Management System:

```typescript
// Products
<Package />        // Product listings
<Boxes />          // Multiple products
<PackageCheck />   // Product validation

// Raw Materials
<Layers />         // Material management
<Component />      // Material composition

// Production
<Factory />        // Production/manufacturing
<TrendingUp />     // Production suggestions
<BarChart3 />      // Production metrics

// Inventory
<Warehouse />      // Stock/warehouse
<Minus />          // Reduce stock
<Plus />           // Add stock
```

### Usage Examples

#### Button with Icon
```typescript
import { Plus } from 'lucide-react';

<button className="button-primary">
  <Plus size={16} />
  <span>Add Product</span>
</button>
```

#### Icon-Only Button
```typescript
import { Trash2 } from 'lucide-react';

<button 
  className="button-destructive" 
  aria-label="Delete product"
>
  <Trash2 size={20} />
</button>
```

#### Loading Spinner
```typescript
import { Loader2 } from 'lucide-react';

<Loader2 className="animate-spin" size={24} />
```

#### Status Indicator
```typescript
import { CheckCircle, AlertCircle } from 'lucide-react';

{isSuccess ? (
  <CheckCircle className="text-green-600" size={20} />
) : (
  <AlertCircle className="text-red-600" size={20} />
)}
```

### Accessibility with Icons

Always provide context for screen readers:

```typescript
// Icon with visible label - OK
<button>
  <Trash2 size={16} />
  <span>Delete</span>
</button>

// Icon only - MUST have aria-label
<button aria-label="Delete product">
  <Trash2 size={20} />
</button>

// Decorative icon - use aria-hidden
<div>
  <Info aria-hidden="true" size={16} />
  <span>Additional information available</span>
</div>
```

### Animation

For loading states, use the spin animation:

```typescript
import { Loader2 } from 'lucide-react';

// Add spin animation via Tailwind
<Loader2 className="animate-spin" />

// Or with custom CSS
<Loader2 className="icon-spin" />
```

```css
/* In your CSS */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.icon-spin {
  animation: spin 1s linear infinite;
}
```

### Performance Tips

- Import only icons you use (tree-shaking):
  ```typescript
  // Good - specific imports
  import { Plus, Edit, Trash2 } from 'lucide-react';
  
  // Avoid - importing entire library
  import * as Icons from 'lucide-react';
  ```

- Create icon components for frequently used icons:
  ```typescript
  // components/icons/DeleteIcon.tsx
  import { Trash2 } from 'lucide-react';
  
  export const DeleteIcon = () => (
    <Trash2 size={20} className="text-red-600" />
  );
  ```

---

## Accessibility Guidelines

### Focus Indicators
```css
:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```

### Color Contrast
- Text on background: Minimum 4.5:1 ratio
- Large text (18pt+): Minimum 3:1 ratio
- Interactive elements: Minimum 3:1 ratio

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Logical tab order
- Visible focus indicators
- Escape key closes modals

### Screen Readers
- Use semantic HTML
- Provide alt text for images
- Use ARIA labels where needed
- Announce dynamic content changes

---

## Animation Guidelines

### Timing Functions
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Duration
- **Quick:** 150ms (hover states)
- **Default:** 300ms (transitions)
- **Slow:** 500ms (complex animations)

### Best Practices
- Respect `prefers-reduced-motion`
- Keep animations subtle
- Use for feedback, not decoration

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Empty States

### No Data Display
```jsx
<div className="empty-state">
  <div className="empty-state-icon">
    {/* Icon component */}
  </div>
  <h3 className="empty-state-title">No products found</h3>
  <p className="empty-state-description">
    Get started by creating your first product
  </p>
  <button className="button-primary">Create Product</button>
</div>
```

```css
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-state-icon {
  color: var(--muted-foreground);
  margin-bottom: 1rem;
}

.empty-state-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.empty-state-description {
  color: var(--muted-foreground);
  margin-bottom: 1.5rem;
}
```

---

## Error States

### Form Validation Error
```jsx
<div className="form-field">
  <label className="label">Product Code</label>
  <input 
    className="input input-error" 
    aria-invalid="true"
    aria-describedby="code-error"
  />
  <p id="code-error" className="error-message">
    Product code already exists
  </p>
</div>
```

### Page Error
```jsx
<div className="error-container">
  <h2 className="error-title">Something went wrong</h2>
  <p className="error-description">
    Unable to load products. Please try again.
  </p>
  <button className="button-primary">Retry</button>
</div>
```

---

## Data Display

### Number Formatting

```typescript
// Currency
const formatCurrency = (value: number) => 
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);

// Integer with thousands separator
const formatNumber = (value: number) => 
  new Intl.NumberFormat('en-US').format(value);

// Percentage
const formatPercent = (value: number) => 
  new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
```

### Code Display
```css
.code {
  font-family: var(--font-mono);
  background: var(--muted);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}
```

---

## Best Practices

### DO ✅
- Use consistent spacing (multiples of 4px)
- Maintain color contrast ratios
- Provide clear feedback for user actions
- Use semantic HTML elements
- Test on multiple devices/browsers
- Implement loading states
- Show empty states
- Use consistent terminology

### DON'T ❌
- Use emojis in professional interfaces
- Override browser defaults without reason
- Use color as the only indicator
- Nest interactive elements
- Use generic error messages
- Hide important actions
- Use too many font sizes
- Overuse animations

---

## Development Workflow

### CSS Architecture
- **Utility-first:** Tailwind CSS approach
- **Component Styles:** Scoped to components
- **Global Styles:** Minimal, only for resets

### Tailwind Configuration

#### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
```

#### globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Colors */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    
    /* Border radius */
    --radius: 0.5rem;
  }
  
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```

### Font Loading Setup

#### index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Inventory Management System</title>
    
    <!-- Preconnect for better performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Inter Font -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Optional: JetBrains Mono for code -->
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### CSS Naming (if not using Tailwind)
- BEM methodology: `.block__element--modifier`
- Semantic class names
- Avoid presentational names

### CSS Variables
- Define in `:root`
- Use for theming
- Consistent naming convention

---

## Browser Support

**Target Browsers:**
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

**Progressive Enhancement:**
- Core functionality works everywhere
- Enhanced features for modern browsers
- Graceful degradation for older browsers

---

## Performance

### CSS Optimization
- Minimize CSS bundle size
- Remove unused styles (PurgeCSS)
- Use CSS containment when appropriate

### Image Optimization
- Use appropriate formats (WebP with fallback)
- Lazy load images
- Provide alt text

### Font Loading
- Use system fonts for performance
- Subset custom fonts if used
- Use `font-display: swap`

---

## Component Library

**Recommended:** Shadcn/UI
- Pre-built accessible components
- Customizable with Tailwind
- TypeScript support
- Copy-paste, not installed

**Alternative:** Build custom with:
- Radix UI (headless primitives)
- Tailwind CSS (styling)
- Custom compositions
