# NexStudy CSS Theme Context

Use this document as context when designing a new color palette for the NexStudy frontend.

## Goal

Create a polished, accessible color system for both `DARK` and `LIGHT` modes. The application is a student study-management dashboard with authentication screens, a sidebar, profile/settings pages, attendance tracking, timetable/hour tables, notifications, forms, modals, loading states, and toast messages.

The preferred implementation is to update the shared theme variables in `src/style/theme.css`. Keep the variable names unchanged because many component styles depend on them. Update component CSS only when a hard-coded color prevents the new palette from working correctly.

## Theme switching

The app sets the theme on the root element:

```html
<html data-theme="DARK">
```

Supported values:

```css
:root[data-theme="DARK"] { }
:root[data-theme="LIGHT"] { }
```

The default/fallback variables are currently defined on `:root`, and the light-mode variables override them under `[data-theme="LIGHT"]`. `color-scheme: dark` and `color-scheme: light` are also used.

## Current shared variables

### Surface/background variables

These are used for page backgrounds, cards, panels, sidebars, tables, inputs, modals, and loading states.

```css
--base-clr-01 /* main page/background surface */
--base-clr-02 /* cards, panels, sidebar, inputs, modal surface */
--base-clr-03 /* elevated section, notification, table or option surface */
--base-clr-04 /* muted surface, disabled state, secondary control */
```

### Text variables

```css
--text-clr-01 /* primary headings and high-emphasis text */
--text-clr-02 /* normal body text, labels, controls */
--text-clr-03 /* secondary body text */
--text-clr-04 /* muted/helper text, metadata, decorative lines */
```

### Utility and semantic variables

```css
--shadow-clr-01       /* component shadows */
--border-clr-01      /* borders and separators */
--hover-clr-01       /* hover/selected surface */
--scrollbar-track    /* scrollbar track */
--scrollbar-thumb    /* scrollbar thumb */
--scrollbar-thumb-hover

--royal-blue         /* primary action/accent/focus color */
--forest-green       /* success, holiday, positive status */
--crimson-red        /* error, danger, delete, missed status */
--light-crime        /* light text/icon color used on accent controls */
```

## Palette requirements

1. Dark mode should feel rich and layered, not pure black.
2. Light mode should feel clean and readable, not washed out.
3. `--text-clr-01` and `--text-clr-02` must have strong contrast on `--base-clr-01` and `--base-clr-02`.
4. `--text-clr-04` must remain readable for metadata and helper text.
5. `--border-clr-01` must be visible in both modes without looking heavy.
6. `--hover-clr-01` must be visible on sidebar items, settings options, and interactive rows.
7. `--royal-blue` is used for primary buttons, active navigation, focus states, loading indicators, and links.
8. `--forest-green` and `--crimson-red` must remain distinguishable for attendance/status feedback.
9. Accent text placed on accent backgrounds must remain readable.
10. Keep the same semantic meaning between light and dark modes; only adjust values for contrast.
11. Avoid changing layout, spacing, typography, border radius, or component behavior when only creating a palette.
12. Prefer CSS variables over adding new hard-coded colors.

## CSS file inventory

### Shared/global styles

- `src/style/theme.css` - central color variables, semantic colors, shadows, borders, hover state, scrollbar colors.
- `src/style/fonts.css` - font-face declarations and font variables.
- `src/index.css` - global reset, body background/font, text-selection behavior, and scrollbar styling.

### Layout styles

- `src/layouts/zMainLayout.css` - main app grid and outlet text color.
- `src/layouts/zAuthLayout.css` - authentication background, dotted grid, glow/mask effect, guide lines, coordinate readout, and ambient copy.
- `src/utils/FlipOutlet.css` - outlet/page transition background.
- `src/utils/zAppLoadingScreen.css` - loading screen, spinner border, and primary-color spinner edge.

### App shell and navigation

- `src/components/zSidebar.css` - sidebar surface, navigation items, child items, profile footer, logout menu, and buttons.
- `src/components/zProfileNavbar.css` - profile/settings navigation, active item, borders, and danger action.
- `src/components/zAppearance.css` - appearance settings cards, theme selectors, selected state, preview controls, borders, and primary accent.
- `src/components/zAccount.css` - account settings fields, helper text, hover/focus states, and shadows.
- `src/components/zPassword.css` - password form, inputs, focus states, submit button, validation and status messages.

### Dashboard and data views

- `src/components/zTodayClasses.css` - today classes card, event rows, event-color mix, labels, and action controls.
- `src/components/zSubjetcsData.css` - subjects list/cards, event-color mix, subject status badges, blue/red hard-coded status colors.
- `src/components/zHourTable.css` - timetable/hour table, event blocks, grid lines, controls, sliders, popovers, modal surfaces, and many `color-mix()` usages.
- `src/components/zAttendanceGrid.css` - attendance panel, calendar/grid cells, attended/missed/holiday colors, controls, and shadows.
- `src/pages/app/zAttendances.css` - attendance page-level layout and sections.
- `src/pages/app/zProfile.css` - profile page background, profile text, and profile sections.

### Feedback, overlays, and loading

- `src/components/zNotifications.css` - notification list, unread/active state, borders, and primary action.
- `src/components/zToast.css` - toast text and toast surface.
- `src/components/zOtpPopup.css` - OTP overlay, bottom sheet/modal, inputs, focus/error states, and buttons.
- `src/components/zEditProfileModel.css` - edit-profile overlay, modal, inputs, buttons, separators, and shadows.
- `src/components/zSkeleton.css` - skeleton loading surfaces, shimmer gradients, and placeholder borders.

### Authentication

- `src/pages/auth/zRegister.css` - registration form, inputs, buttons, focus rings, card shadows, and overlay effects.

## Existing hard-coded colors to consider

Most application colors use the shared variables, but these files still contain fixed colors or fixed alpha overlays:

- `src/index.css`
  - Global scrollbar colors are variable-based and should remain connected to the theme.
- `src/layouts/zAuthLayout.css`
  - White dotted-grid/glow colors and black radial mask gradients.
  - Cyan glow: `rgba(0, 255, 204, 0.8)`.
- `src/components/zAppearance.css`
  - Fixed blue translucent preview background: `rgba(1, 75, 186, 0.18)`.
- `src/components/zNotifications.css`
  - Fixed blue translucent background: `rgba(1, 75, 186, 0.18)`.
- `src/components/zPassword.css`
  - Fixed blue translucent background: `rgba(1, 75, 186, 0.18)`.
- `src/components/zProfileNavbar.css`
  - Fixed red translucent danger background: `rgba(221, 4, 38, 0.08)`.
- `src/components/zSubjetcsData.css`
  - Fixed status colors: `#0ea5e9` (blue) and `#ef4444` (red), including `color-mix()`.
- `src/components/zOtpPopup.css`
  - Fixed black overlay and shadow alpha values, plus a fixed red error focus ring.
- `src/components/zEditProfileModel.css`
  - Fixed black overlays/shadows and a fixed indigo focus ring.
- `src/components/zHourTable.css`
  - Fixed black overlay/shadows and fixed indigo focus rings; also uses `color-mix()`.
- `src/components/zAttendanceGrid.css`
  - Fixed black shadow.
- `src/pages/auth/zRegister.css`
  - Fixed indigo/blue focus rings and black shadows.
- `src/components/zSkeleton.css`
  - White shimmer and placeholder borders, which may need dark/light-specific tuning.

## Important implementation details

- Many controls use `var(--text-clr-02)` as a background and `var(--base-clr-02)` as foreground text. The palette must keep this combination readable in both modes.
- Some controls use `var(--base-clr-04)` as a background and `var(--base-clr-01)` or text colors as foreground.
- Timetable and subject cards use custom runtime variables such as `--event-color`, `--accent-clr`, `--attend-clr`, `--miss-clr`, and `--holiday-clr`. Do not remove or rename these.
- `color-mix(in srgb, ...)` is used for event backgrounds, borders, and status backgrounds. Accent colors should work when mixed with both light and dark surfaces.
- Authentication uses a decorative dotted/glow background. A new palette should preserve this visual identity while ensuring the form remains the focal point.
- The app uses Poppins globally, with additional font variables in `fonts.css`.
- Keep the palette compatible with modern Chromium, Firefox, and Safari.

## Recommended output from the palette designer

Return:

1. A complete replacement for `src/style/theme.css`.
2. Any minimal changes needed for hard-coded colors listed above.
3. A short explanation of the palette roles.
4. Contrast notes for primary text, secondary text, buttons, status colors, and focus rings.
5. Do not rename existing variables or change component layout.

## Copy-paste request for another AI

```text
You are redesigning the color palette of an existing React/CSS student dashboard called NexStudy.

Use the attached CSS theme context. Create a cohesive, accessible palette for both DARK and LIGHT modes.

Requirements:
- Keep every existing CSS variable name unchanged.
- Prefer editing only src/style/theme.css.
- Preserve the semantic roles of base-clr, text-clr, border, hover, shadow, scrollbar, royal-blue, forest-green, crimson-red, and light-crime.
- Make dark mode layered and elegant, not pure black.
- Make light mode bright, polished, and high-contrast, not gray or washed out.
- Ensure primary text, secondary text, muted text, borders, hover states, buttons, focus rings, attendance states, and notification states remain readable.
- Ensure colors work with existing color-mix() rules and runtime variables such as --event-color, --accent-clr, --attend-clr, --miss-clr, and --holiday-clr.
- Do not change layout, spacing, typography, component behavior, or variable names.
- Identify any hard-coded CSS colors that must be adjusted to make the palette consistent.

Return a complete replacement theme.css, followed by optional minimal hard-coded-color fixes and a brief explanation.
```
