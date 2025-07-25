# Bottom Toolbar Position Implementation Plan

This document outlines the implementation plan for adding a bottom toolbar positioning feature to React Cosmos UI, which will be particularly useful for mobile devices.

## Overview

The feature involves:
1. Adding a new persistent UI state for toolbar position (top/bottom)
2. Default position based on screen size (bottom for mobile, top for desktop)
3. When toolbar is at bottom, nav and control panel headers should also be at bottom
4. Panel footers should be inverted accordingly
5. Notifications should appear at top when toolbar is at bottom
6. Add a toggle button in nav panel footer

## Implementation Steps

### 1. Create Persistent State Management

**File to create:** `/packages/react-cosmos-ui/src/plugins/Root/persistentState/toolbarPosition.ts`

This file will handle the persistent state for toolbar position, following the pattern of `drawerPanels.ts`:
- Storage key: `'toolbarPosition'`
- Type: `'top' | 'bottom'`
- Default value: `window.innerHeight > window.innerWidth && window.innerWidth < 768 ? 'bottom' : 'top'` (bottom for mobile portrait mode)
- Export functions:
  - `getToolbarPosition(context: RootContext): 'top' | 'bottom'`
  - `setToolbarPosition(context: RootContext, position: 'top' | 'bottom')`

### 2. Update Root Plugin Specification

**File to modify:** `/packages/react-cosmos-ui/src/plugins/Root/spec.ts`

Add new methods to the RootSpec interface:
```typescript
methods: {
  // ... existing methods
  getToolbarPosition: () => 'top' | 'bottom';
  setToolbarPosition: (position: 'top' | 'bottom') => void;
}
```

### 3. Update Root Plugin Implementation

**File to modify:** `/packages/react-cosmos-ui/src/plugins/Root/index.tsx`

- Import the new persistent state functions
- Add methods to the plugin registration
- Pass toolbar position to Root component
- Create a setter function for the Root component

### 4. Update Root Component

**File to modify:** `/packages/react-cosmos-ui/src/plugins/Root/Root.tsx`

- Add `toolbarPosition: 'top' | 'bottom'` prop
- Add `setToolbarPosition: (position: 'top' | 'bottom') => void` prop
- Pass these props to RendererHeader, NavPanel, and ControlPanel components
- Restructure the renderer container to support bottom positioning

### 5. Update RendererHeader Component

**File to modify:** `/packages/react-cosmos-ui/src/plugins/Root/RendererHeader.tsx`

- Add `position: 'top' | 'bottom'` prop
- Update Container styled component to position at bottom when needed:
  - When `position === 'bottom'`: 
    - Remove `border-bottom` and add `border-top`
    - Use absolute positioning at bottom of parent
- Pass position to child components if needed

### 6. Update NavPanel Component

**File to modify:** `/packages/react-cosmos-ui/src/plugins/Root/NavPanel.tsx`

- Add `toolbarPosition: 'top' | 'bottom'` prop
- Add `onToggleToolbarPosition: () => void` prop
- When toolbar is at bottom:
  - Move header content (currently none) to bottom
  - Keep footer at bottom but add the toggle button for toolbar position
- Add new IconButton32 in footer for toggling toolbar position
  - Use an appropriate icon (e.g., ArrowUp/ArrowDown or similar)
  - Title: "Toggle toolbar position"

### 7. Update ControlPanel Component

**File to modify:** `/packages/react-cosmos-ui/src/plugins/Root/ControlPanel.tsx`

- Add `toolbarPosition: 'top' | 'bottom'` prop
- When toolbar is at bottom:
  - Move header content to bottom (after content)
  - Reverse flex-direction or reorder components
- Update styled components accordingly

### 8. Update Notifications Component

**File to modify:** `/packages/react-cosmos-ui/src/plugins/Notifications/Notifications.tsx`

- Add `toolbarPosition: 'top' | 'bottom'` prop
- Update Container styled component:
  - When `position === 'top'`: `top: 8px` instead of `bottom: 8px`
  - Animation should come from top when position is top

**File to modify:** `/packages/react-cosmos-ui/src/plugins/Notifications/index.tsx`

- Get toolbar position from Root plugin
- Pass it to Notifications component

### 9. Add Toggle Icon

**Files to check:** `/packages/react-cosmos-ui/src/components/icons/`

Need to find or add an appropriate icon for toggling vertical position. Options:
- Use existing ChevronUp/ChevronDown icons
- Use existing Move icon if available
- Add new icon if needed

## Testing Considerations

1. Test default position on different screen sizes
2. Test persistence of the setting across page reloads
3. Test all UI elements reposition correctly:
   - Renderer header
   - Nav panel header/footer
   - Control panel header
   - Notifications
4. Test responsiveness when window is resized
5. Test drawer panels mode with bottom positioning
6. Ensure smooth transitions

## File Change Summary

### New Files:
1. `/packages/react-cosmos-ui/src/plugins/Root/persistentState/toolbarPosition.ts`

### Modified Files:
1. `/packages/react-cosmos-ui/src/plugins/Root/spec.ts`
2. `/packages/react-cosmos-ui/src/plugins/Root/index.tsx`
3. `/packages/react-cosmos-ui/src/plugins/Root/Root.tsx`
4. `/packages/react-cosmos-ui/src/plugins/Root/RendererHeader.tsx`
5. `/packages/react-cosmos-ui/src/plugins/Root/NavPanel.tsx`
6. `/packages/react-cosmos-ui/src/plugins/Root/ControlPanel.tsx`
7. `/packages/react-cosmos-ui/src/plugins/Notifications/Notifications.tsx`
8. `/packages/react-cosmos-ui/src/plugins/Notifications/index.tsx`

## Implementation Order

1. Create persistent state management file
2. Update Root plugin spec and implementation
3. Update Root component to pass props
4. Update individual components (RendererHeader, NavPanel, ControlPanel)
5. Update Notifications
6. Add toggle button with icon
7. Test thoroughly

## Notes

- Follow existing patterns for consistency (e.g., how drawerPanels is implemented)
- Ensure all transitions are smooth using the existing `quick` transition variable
- Consider accessibility: keyboard shortcuts might be useful
- The feature should work seamlessly with existing drawer panels mode