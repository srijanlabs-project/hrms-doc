# 02. Foundations: Color, Typography, Layout, Grid, Spacing, Elevation

## 1. Color System

### 1.1 Color Roles

The system uses a role-based color model:

- `Primary` for brand anchor, nav emphasis, primary actions
- `Secondary Accent` for AI prompts, guided action, and emphasis
- `Neutral` for text, borders, panels, and app surfaces
- `Semantic` for success, warning, error, and info
- `Data Viz` for dashboard and chart differentiation

### 1.2 Primary Teal Scale

Recommended scale:

- `primary-50` `#EAF8F7`
- `primary-100` `#D3F0EE`
- `primary-200` `#A7E0DD`
- `primary-300` `#7ACFCD`
- `primary-400` `#4DBDBE`
- `primary-500` `#1FA9AE`
- `primary-600` `#0F8B8D`
- `primary-700` `#0C6F72`
- `primary-800` `#0A5658`
- `primary-900` `#083E40`

Usage:

- `primary-600` default primary button and active navigation
- `primary-700` hover or selected dense surfaces
- `primary-800` brand text and dark nav backgrounds
- `primary-100` to `primary-300` soft fills and highlights

### 1.3 Secondary Orange Scale

Recommended scale:

- `accent-50` `#FFF4E8`
- `accent-100` `#FFE7CB`
- `accent-200` `#FFD09B`
- `accent-300` `#FFB669`
- `accent-400` `#FF9B36`
- `accent-500` `#F78A1D`
- `accent-600` `#D86F10`
- `accent-700` `#AA530C`
- `accent-800` `#7D3D09`
- `accent-900` `#562805`

Usage:

- AI action buttons
- warning-emphasis chips
- active stepper stage
- guided recommendations and insight markers

### 1.4 Neutral Scale

Recommended scale:

- `neutral-0` `#FFFFFF`
- `neutral-50` `#F8FAFC`
- `neutral-100` `#F1F5F9`
- `neutral-200` `#E2E8F0`
- `neutral-300` `#CBD5E1`
- `neutral-400` `#94A3B8`
- `neutral-500` `#64748B`
- `neutral-600` `#475569`
- `neutral-700` `#334155`
- `neutral-800` `#1E293B`
- `neutral-900` `#0F172A`

Usage:

- `neutral-900` primary text
- `neutral-600` secondary text
- `neutral-300` borders
- `neutral-50` app background
- `neutral-0` cards, panels, sheets

### 1.5 Semantic Colors

- `success-500` `#16A34A`
- `warning-500` `#F59E0B`
- `error-500` `#EF4444`
- `info-500` `#2563EB`

Soft semantic backgrounds:

- `success-soft` `#ECFDF3`
- `warning-soft` `#FFFBEB`
- `error-soft` `#FEF2F2`
- `info-soft` `#EFF6FF`

### 1.6 Data Visualization Palette

Primary chart palette:

- `viz-1` `#0F8B8D`
- `viz-2` `#F78A1D`
- `viz-3` `#2563EB`
- `viz-4` `#16A34A`
- `viz-5` `#7C3AED`
- `viz-6` `#E11D48`

Dashboard charts must preserve:

- AA contrast on labels
- line thickness adequate for large screens
- explicit legends where color meaning is not obvious

## 2. Typography

### 2.1 Typeface

Primary typeface:

- `Inter`

Fallback stack:

- `Inter`, `Segoe UI`, `Arial`, `sans-serif`

Reason:

- the approved visual direction already uses `Inter`
- it reads well in dense enterprise tables and forms
- it scales cleanly across desktop and mobile

### 2.2 Type Roles

- `Display XL` for hero metrics and major landing pages
- `Display L` for major section titles
- `H1` for page titles
- `H2` for panel and section titles
- `H3` for card titles
- `H4` for grouped subsection labels
- `Body` for regular content
- `Body Small` for compact summaries
- `Caption` for helper, metadata, and timestamps
- `Label` for fields, controls, and chips

### 2.3 Type Scale

- `Display XL` `56 / 64 / 700`
- `Display L` `48 / 56 / 600`
- `H1` `32 / 40 / 600`
- `H2` `24 / 32 / 600`
- `H3` `20 / 28 / 600`
- `H4` `16 / 24 / 600`
- `Body` `14 / 22 / 400`
- `Body Small` `13 / 20 / 400`
- `Caption` `12 / 18 / 400`
- `Label` `12 / 16 / 500`

### 2.4 Typographic Rules

- avoid center-aligned body text in application screens
- use sentence case for UI labels and action text
- use tabular numerals in metrics, payroll, and tables where alignment matters
- keep maximum readable text measure between `60` and `80` characters in descriptive areas
- date, time, and amount formatting must follow locale

## 3. Layout System

### 3.1 App Shell

Desktop shell zones:

- left rail navigation
- top global header
- content column
- optional right insight or detail rail

Mobile shell zones:

- top app bar
- scrollable content stack
- bottom navigation
- contextual drawers and sheets

### 3.2 Content Width Rules

- wide admin workbenches:
  `1440px` target canvas
- standard dashboard and record pages:
  `1280px` target content width
- readable text content:
  `960px` max content width

## 4. Grid System

### 4.1 Desktop Grid

- `12-column` grid
- `24px` outer margin
- `24px` gutter

Usage:

- dashboards: 12-column
- admin workbenches: 12-column with fixed utility rails
- profile pages: 8 to 12-column hybrid depending on panel count

### 4.2 Tablet Grid

- `8-column` grid
- `20px` outer margin
- `20px` gutter

### 4.3 Mobile Grid

- `4-column` grid
- `16px` outer margin
- `16px` gutter

## 5. Spacing System

Base spacing unit:

- `4px`

Spacing scale:

- `space-1` `4px`
- `space-2` `8px`
- `space-3` `12px`
- `space-4` `16px`
- `space-5` `20px`
- `space-6` `24px`
- `space-8` `32px`
- `space-10` `40px`
- `space-12` `48px`
- `space-14` `56px`
- `space-16` `64px`
- `space-20` `80px`

Usage rules:

- field to field inside a form:
  `12px` to `16px`
- card padding:
  `20px` to `24px`
- page section spacing:
  `24px` to `32px`
- dashboard zone spacing:
  `24px`

## 6. Radius System

- `radius-sm` `6px`
- `radius-md` `10px`
- `radius-lg` `14px`
- `radius-xl` `20px`
- `radius-pill` `999px`

Usage:

- form fields and secondary chips:
  `10px`
- cards and panels:
  `14px`
- hero tiles and surface groups:
  `20px`
- status pills and segmented controls:
  `pill`

## 7. Elevation System

The product should use low-contrast depth rather than dramatic shadow.

### 7.1 Shadow Tokens

- `elevation-0`
  `none`
- `elevation-1`
  `0 1px 2px rgba(15, 23, 42, 0.06)`
- `elevation-2`
  `0 6px 18px rgba(15, 23, 42, 0.08)`
- `elevation-3`
  `0 12px 32px rgba(15, 23, 42, 0.10)`
- `elevation-4`
  `0 20px 40px rgba(15, 23, 42, 0.14)`

Usage:

- default cards:
  `elevation-1`
- active panels or sticky cards:
  `elevation-2`
- modal and drawer:
  `elevation-3`
- high-priority overlay:
  `elevation-4`

## 8. Border System

- standard border:
  `1px solid neutral-300`
- focus ring:
  `2px solid primary-500`
- error border:
  `1px solid error-500`
- success border:
  `1px solid success-500`

## 9. Theme Position

Default theme:

- `light`

Dark theme is not the primary delivery requirement. If added later, it should be a controlled extension rather than the design baseline.
