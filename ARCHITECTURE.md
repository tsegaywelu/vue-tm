# TMS Modern Architecture (Raaz-Inspired)

This document defines the core architecture and development rules for the TMS frontend project. It is modeled after the **Raaz project** to ensure reliability and modularity.

## Core Technology Stack
- **Framework**: Vue 3 (Composition API)
- **State Management**: Pinia 3
- **Data Fetching**: TanStack Vue Query
- **Styling**: Tailwind CSS 4 (with Raaz custom theme)
- **Forms**: TanStack Vue Form (with focus-on-error)
- **Modals**: Modal-X v0.2.x (File-based registry)

## Naming Conventions
- **Variables**: `snake_case` (e.g., `const current_user_id = ...`)
- **Components**: `PascalCase` (e.g., `SubmitButton.vue`)
- **Files**: `PascalCase` for components, `camelCase` or `kebab-case` for utils/apis.

## Directory Structure
```text
src/
├── api/             # Global API clients and configurations
├── components/      # Shared/Global UI components (Buttons, Inputs, etc.)
├── composables/     # Global business logic and hooks (usePagination)
├── layouts/         # High-level layouts (DashboardLayout.vue)
├── modules/         # Feature-based modular capsules
│   ├── [feature]/   # e.g., shipment, operation
│   │   ├── api/     # Feature-specific API logic
│   │   ├── components/ # Feature-specific UI
│   │   └── pages/   # Feature views/routes
├── modals/          # Global modal registry and base components
├── router/          # Vue Router definitions and guards
├── store/           # Global Pinia store definitions
├── types/           # Global TypeScript definitions
└── utils/           # Helper functions and constants (icons.ts)
```

## Architectural Rules

### 1. Modular Encapsulation
Features should be self-contained within the `src/modules/` directory. Only shared UI elements or global logic should reside in the top-level `components/` or `composables/` folders.

### 2. Styling (Raaz Theme)
All styling must strictly follow the Raaz design system defined in `src/style.css`. Avoid ad-hoc color codes; use the defined CSS variables (e.g., `var(--color-primary)`).

### 3. Forms & Validation
Use TanStack Vue Form. Interactive elements must have `data-name` attributes corresponding to their field names to support the automatic focus-on-error mechanism.

### 4. Modals
New modals should use the `.mdl.vue` naming convention and be registered in the `src/modals/` system (using Modal-X) to maintain type safety and consistent behavior.
