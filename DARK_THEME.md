# Newspaper.AI Dark Theme Implementation

This document explains the design system and components used in the Newspaper.AI dark theme implementation.

## 🎨 Core Color Palette

The dark theme uses a cohesive color palette with the following key components:

### Background Colors
- `--primary-bg`: #121218 (Base background)
- `--primary-bg-light`: #1a1a22 (Lighter background)
- `--primary-bg-dark`: #0c0c10 (Darker background)
- `--secondary-bg`: #1e1e26 (Card backgrounds)
- `--secondary-bg-light`: #26262f (Lighter card backgrounds)
- `--secondary-bg-dark`: #17171e (Darker card backgrounds)
- `--tertiary-bg`: #282834 (Alt backgrounds)

### Accent Colors
- `--primary-accent`: #00e5ff (Primary cyan accent)
- `--primary-accent-light`: #33eaff (Lighter cyan)
- `--primary-accent-dark`: #00b8cc (Darker cyan)
- `--secondary-accent`: #ff3d71 (Secondary magenta accent)
- `--secondary-accent-light`: #ff668e (Lighter magenta)
- `--secondary-accent-dark`: #cc305a (Darker magenta)

### Text Colors
- `--text-primary`: #ffffff (Primary text)
- `--text-secondary`: #a9a9b8 (Secondary text)

### Status Colors
- `--success-color`: #00c853
- `--warning-color`: #ffcb2f
- `--error-color`: #ff375f

## 🔡 Typography System

The typography system uses a modular scale with the following font sizes:

- `--font-headline`: 2rem (32px)
- `--font-subheading`: 1.5rem (24px)
- `--font-featured`: 1.25rem (20px)
- `--font-body`: 1rem (16px)
- `--font-caption`: 0.875rem (14px)
- `--font-small`: 0.75rem (12px)

Line heights:
- `--line-height-headline`: 1.3
- `--line-height-body`: 1.5
- `--line-height-ui`: 1.2

Font families:
- Primary: Inter (sans-serif)
- Secondary: JetBrains Mono (monospace)

## 📦 3D Card System

The 3D card system uses several techniques to create depth and interactivity:

### Card Features
- 3D transformations with preserve-3D
- Layered design with z-indexing
- Subtle rotation on hover
- Light source effects
- Elevation system

### Z-Index System
- `--z-ground`: 0
- `--z-raised`: 10
- `--z-floating`: 20
- `--z-overlay`: 30
- `--z-modal`: 40
- `--z-toast`: 50

### Elevation System
- `--elevation-1`: 0px 2px 6px rgba(0, 0, 0, 0.2)
- `--elevation-2`: 0px 6px 16px rgba(0, 0, 0, 0.3)
- `--elevation-3`: 0px 8px 24px rgba(0, 0, 0, 0.4)
- `--elevation-4`: 0px 12px 28px rgba(0, 0, 0, 0.5)

## 🎯 Key Components

### NewsCard Component

The `NewsCard` component showcases the 3D card system with advanced hover effects:

```jsx
<NewsCard 
  article={article}
  featured={true}
  size="medium"
  onClick={handleArticleClick}
  onSave={handleSaveArticle}
  onShare={handleShareArticle}
/>
```

#### Props
- `article`: Article object with content
- `featured`: Boolean for enhanced styling
- `size`: 'small' | 'medium' | 'large'
- `variant`: 'default' | 'minimal' | 'featured'
- `onClick`: Function for card click
- `onSave`: Function for save action
- `onShare`: Function for share action

### Utility Classes

The theme includes several utility classes for creating 3D effects:

```jsx
<div className="perspective-500">
  <div className="preserve-3d">
    <div className="translate-z-4">
      Content with depth
    </div>
  </div>
</div>
```

Common utility classes:
- `perspective-500`: Adds perspective transform
- `perspective-1000`: Adds deeper perspective transform
- `preserve-3d`: Preserves 3D transformations for children
- `backface-hidden`: Hides backface during transforms
- `translate-z-[value]`: Translates element along Z-axis (0, 2, 4, 8, 10, 20)
- `rotate-y-[value]`: Rotates element around Y-axis (1, 2, -1, -2)
- `inner-light`: Adds subtle highlight to top edge
- `light-source-top`: Adds light source at top
- `light-source-top-left`: Adds light source at top-left
- `frosted-glass`: Creates frosted glass effect

## 💫 Animation System

The animation system includes several built-in animations:

- `animate-float`: Gentle floating motion
- `animate-pulse-glow`: Pulsing glow effect
- `animate-press`: Press/click effect
- `animate-micro-bounce`: Subtle bounce

Transition speeds:
- `--transition-fast`: 150ms
- `--transition-medium`: 300ms
- `--transition-slow`: 500ms

## 📱 Responsive Behavior

The design system is fully responsive with adaptive layouts:

- Mobile-first approach
- Fluid spacing system
- Adaptive card sizes
- Content prioritization

## 🖥️ Usage in Application

The dark theme is implemented throughout the application:

1. **Home Page**: Featured news with 3D cards
2. **News Feed**: Grid of interactive cards
3. **Article Detail**: Enhanced reading experience

## 🛠️ Implementation in New Components

To implement the dark theme in new components:

1. Use the CSS variables for consistent styling
2. Apply the utility classes for 3D effects
3. Use the animation system for interactive elements
4. Ensure responsive behavior with mobile-first approach

## 🎭 Dark Mode Considerations

The design system is primarily dark-mode focused but includes considerations for light mode:

- High contrast for accessibility
- Consistent interactive states
- Proper focus states
- Reduced motion options

## 📄 Example Use Cases

### Basic Card
```jsx
<div className="bg-secondary-bg p-4 rounded-lg shadow-elevation-1 inner-light">
  <h3 className="text-headline font-bold">Card Title</h3>
  <p className="text-text-secondary">Card content goes here.</p>
</div>
```

### 3D Interactive Card
```jsx
<motion.div 
  className="bg-card-gradient rounded-lg p-4 preserve-3d"
  whileHover={{ rotateY: 2, rotateX: -1, z: 10 }}
>
  <div className="translate-z-4">
    <h3 className="text-headline font-bold">Interactive Card</h3>
    <p className="text-text-secondary">Card with 3D effects</p>
  </div>
</motion.div>
```

### Buttons
```jsx
<button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
  Primary Button
</button>

<button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90">
  Secondary Button
</button>
``` 