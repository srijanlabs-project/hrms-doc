# 07. Design Tokens

## 1. Purpose

This document defines the token architecture for the `Staffsy` design system.

The token model is intended to support:

- design tooling
- frontend implementation
- theme consistency
- accessibility review
- cross-screen reuse

The machine-readable companion file is:

- `staffsy-design-tokens.json`

## 2. Token Categories

- `color`
- `typography`
- `spacing`
- `radius`
- `border`
- `shadow`
- `size`
- `breakpoint`
- `component`

## 3. Token Naming Standard

Recommended pattern:

- `category.role.scale`

Examples:

- `color.primary.600`
- `spacing.6`
- `radius.lg`
- `shadow.2`
- `component.button.primary.bg`

## 4. Color Token Model

Base tokens:

- `color.primary.*`
- `color.accent.*`
- `color.neutral.*`
- `color.success.*`
- `color.warning.*`
- `color.error.*`
- `color.info.*`

Alias tokens:

- `color.text.primary`
- `color.text.secondary`
- `color.text.inverse`
- `color.bg.canvas`
- `color.bg.surface`
- `color.bg.subtle`
- `color.border.default`
- `color.border.focus`
- `color.action.primary`
- `color.action.primaryHover`

## 5. Typography Token Model

- `font.family.base`
- `font.weight.regular`
- `font.weight.medium`
- `font.weight.semibold`
- `font.weight.bold`
- `font.size.display-xl`
- `font.size.h1`
- `font.size.body`
- `font.lineHeight.display-xl`
- `font.lineHeight.body`

## 6. Spacing Token Model

- `spacing.1` through `spacing.20`

Use semantic aliases for common patterns:

- `layout.pagePadding`
- `layout.cardPadding`
- `layout.sectionGap`
- `layout.fieldGap`

## 7. Radius Token Model

- `radius.sm`
- `radius.md`
- `radius.lg`
- `radius.xl`
- `radius.pill`

## 8. Elevation Token Model

- `shadow.0`
- `shadow.1`
- `shadow.2`
- `shadow.3`
- `shadow.4`

## 9. Component Token Examples

Button tokens:

- `component.button.height.sm`
- `component.button.height.md`
- `component.button.primary.bg`
- `component.button.primary.text`
- `component.button.primary.hoverBg`
- `component.button.secondary.border`

Input tokens:

- `component.input.height.md`
- `component.input.bg`
- `component.input.border`
- `component.input.focusRing`
- `component.input.errorBorder`

Card tokens:

- `component.card.bg`
- `component.card.radius`
- `component.card.shadow`
- `component.card.padding`

Navigation tokens:

- `component.nav.sidebar.bg`
- `component.nav.sidebar.activeBg`
- `component.nav.top.height`
- `component.nav.bottom.height`

AI tokens:

- `component.ai.badge.bg`
- `component.ai.badge.text`
- `component.ai.panel.border`
- `component.ai.action.bg`

## 10. Implementation Guidance

- maintain raw tokens separately from semantic aliases
- prefer semantic aliases in components
- do not hardcode color values in components once tokens are adopted
- accessibility changes should be handled by token updates where possible
- charts may use a controlled non-semantic visualization palette, but still require named tokens
