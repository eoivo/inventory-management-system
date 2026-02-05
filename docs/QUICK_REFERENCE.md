# Quick Reference - Typography & Icons

## Font Setup (Inter)

### 1. Install Inter Font

**Via Google Fonts (Recommended):**

Add to your `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

**Via NPM (Alternative):**
```bash
npm install @fontsource/inter
```

Then import in your main CSS/JS:
```typescript
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
```

### 2. Configure Tailwind

In `tailwind.config.js`:
```javascript
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

### 3. Apply in CSS

In `globals.css`:
```css
body {
  font-family: 'Inter', system-ui, sans-serif;
  font-feature-settings: "rlig" 1, "calt" 1;
}
```

---

## Icon Setup (Lucide React)

### 1. Install Lucide React

```bash
npm install lucide-react
```

### 2. Import and Use

```typescript
import { Plus, Edit, Trash2, Package, CheckCircle } from 'lucide-react';

function MyComponent() {
  return (
    <div>
      {/* Icon with default size (24px) */}
      <Plus />
      
      {/* Icon with custom size */}
      <Edit size={20} />
      
      {/* Icon with color class */}
      <Trash2 className="text-red-600" size={18} />
      
      {/* Icon with accessibility */}
      <button aria-label="Add new product">
        <Plus size={16} />
      </button>
    </div>
  );
}
```

---

## Common Use Cases

### Button with Icon + Text
```typescript
import { Plus } from 'lucide-react';

<button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded">
  <Plus size={16} />
  <span>Add Product</span>
</button>
```

### Icon-Only Button
```typescript
import { Pencil } from 'lucide-react';

<button 
  className="p-2 hover:bg-gray-100 rounded"
  aria-label="Edit product"
>
  <Pencil size={18} />
</button>
```

### Status Badge with Icon
```typescript
import { CheckCircle, AlertCircle } from 'lucide-react';

<div className="flex items-center gap-2">
  {status === 'success' ? (
    <CheckCircle className="text-green-600" size={20} />
  ) : (
    <AlertCircle className="text-red-600" size={20} />
  )}
  <span>{message}</span>
</div>
```

### Loading Spinner
```typescript
import { Loader2 } from 'lucide-react';

<Loader2 className="animate-spin" size={24} />
```

### Table Actions
```typescript
import { Eye, Pencil, Trash2 } from 'lucide-react';

<div className="flex items-center gap-2">
  <button aria-label="View">
    <Eye size={16} />
  </button>
  <button aria-label="Edit">
    <Pencil size={16} />
  </button>
  <button aria-label="Delete">
    <Trash2 size={16} />
  </button>
</div>
```

### Empty State
```typescript
import { Package } from 'lucide-react';

<div className="text-center py-12">
  <Package 
    className="mx-auto text-gray-400" 
    size={48} 
    strokeWidth={1.5}
  />
  <h3 className="mt-4 text-lg font-semibold">No products yet</h3>
  <p className="mt-2 text-gray-600">Get started by creating your first product</p>
</div>
```

---

## Icon Reference for Inventory System

```typescript
// Products
import { Package, Boxes, PackageCheck } from 'lucide-react';

// Raw Materials  
import { Layers, Component } from 'lucide-react';

// Production
import { Factory, TrendingUp, BarChart3 } from 'lucide-react';

// Inventory/Stock
import { Warehouse, Plus, Minus } from 'lucide-react';

// Actions
import { 
  Plus,        // Create/Add
  Edit,        // Edit
  Trash2,      // Delete
  Check,       // Save/Confirm
  X,           // Cancel/Close
  Search,      // Search
  Filter,      // Filter
  Download,    // Export
  Upload,      // Import
  RefreshCw,   // Reload
} from 'lucide-react';

// Status
import {
  CheckCircle,    // Success
  AlertCircle,    // Error
  AlertTriangle,  // Warning
  Info,           // Information
  Loader2,        // Loading
} from 'lucide-react';

// Navigation
import {
  ChevronLeft,   // Back
  ChevronRight,  // Forward
  ChevronUp,     // Up/Collapse
  ChevronDown,   // Down/Expand
  Menu,          // Mobile menu
} from 'lucide-react';
```

---

## Font Weight Guide

```typescript
// Light (300) - Rare use, very subtle
<h1 className="font-light">Subtle Heading</h1>

// Normal (400) - Body text, default
<p className="font-normal">Regular paragraph text</p>

// Medium (500) - Emphasis, labels
<label className="font-medium">Form Label</label>

// Semibold (600) - Subheadings, important text
<h3 className="font-semibold">Section Title</h3>

// Bold (700) - Main headings, strong emphasis
<h1 className="font-bold">Page Title</h1>
```

---

## Typography Examples

### Page Title
```typescript
<h1 className="text-3xl font-bold text-gray-900">
  Inventory Management
</h1>
```

### Section Header
```typescript
<h2 className="text-2xl font-semibold text-gray-800">
  Products
</h2>
```

### Card Title
```typescript
<h3 className="text-lg font-semibold text-gray-900">
  Product Details
</h3>
```

### Body Text
```typescript
<p className="text-base font-normal text-gray-700">
  Regular paragraph content
</p>
```

### Small Label
```typescript
<span className="text-sm font-medium text-gray-600">
  Product Code
</span>
```

### Caption/Helper Text
```typescript
<span className="text-xs text-gray-500">
  Optional field
</span>
```

### Code/Monospace (for product codes, IDs)
```typescript
<code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
  PROD001
</code>
```

---

## Complete Example Component

```typescript
import { Package, Plus, Edit, Trash2 } from 'lucide-react';

export function ProductCard({ product }) {
  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      {/* Header with icon */}
      <div className="flex items-center gap-3 mb-4">
        <Package className="text-blue-600" size={24} />
        <h3 className="text-lg font-semibold text-gray-900">
          {product.name}
        </h3>
      </div>
      
      {/* Code (monospace) */}
      <code className="font-mono text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
        {product.code}
      </code>
      
      {/* Value */}
      <p className="mt-3 text-2xl font-bold text-gray-900">
        ${product.value.toFixed(2)}
      </p>
      
      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <button 
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Edit size={16} />
          <span className="text-sm font-medium">Edit</span>
        </button>
        
        <button 
          className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          aria-label="Delete product"
        >
          <Trash2 size={16} />
          <span className="text-sm font-medium">Delete</span>
        </button>
      </div>
    </div>
  );
}
```

---

## Don't Forget

✅ **DO:**
- Use Inter font for all text
- Use Lucide React icons instead of emojis
- Import specific icons (tree-shaking)
- Provide aria-labels for icon-only buttons
- Use font-mono for codes/technical text

❌ **DON'T:**
- Use emojis anywhere in the UI
- Import all Lucide icons at once
- Use icon-only buttons without aria-labels
- Mix different icon libraries
- Use decorative fonts for body text

---

## Testing Your Setup

### Check Font Loading
Open DevTools → Network → Filter by "font" → Should see Inter loading

### Check Icon Import
```typescript
// In any component
import { Package } from 'lucide-react';

console.log(Package); // Should not be undefined
```

### Verify Tailwind Config
```bash
# Check if Inter is in your Tailwind config
cat tailwind.config.js | grep Inter
```

---

## Troubleshooting

**Font not loading?**
- Check internet connection (if using Google Fonts)
- Verify `<link>` tag in index.html
- Clear browser cache
- Check for CORS issues in console

**Icons not showing?**
- Verify `lucide-react` is installed: `npm list lucide-react`
- Check import path is correct
- Ensure component is exported/imported correctly
- Check for TypeScript errors

**Icons too small/large?**
- Adjust `size` prop: `<Plus size={20} />`
- Use Tailwind classes: `<Plus className="w-5 h-5" />`

**Font looks different?**
- Check if Inter is actually loading (DevTools)
- Verify font-family in CSS/Tailwind
- Clear browser cache
- Check font-feature-settings

---

## Additional Resources

- Inter Font: https://rsms.me/inter/
- Lucide Icons: https://lucide.dev/
- Lucide React Docs: https://lucide.dev/guide/packages/lucide-react
- Google Fonts: https://fonts.google.com/specimen/Inter
