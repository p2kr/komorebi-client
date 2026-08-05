# Domain Glossary & Context

This document establishes the authoritative domain vocabulary for **Komorebi**.

## Domain Concepts

### User Profile
A registered identity within Komorebi that links client state to an external media provider account. Each user profile contains a unique identifier (`id` UUID v7), username, provider type (`AniList` | `MAL`), optional avatar URL, authentication token (if authenticated), sandbox status flag, and timestamp metadata (`created_at`, `updated_at`). Managed by a deep `UserManager` module encapsulating local storage caching and OAuth connection timeouts.

### Media Provider
An external third-party media tracking service integrated with Komorebi. Supported providers:
- **AniList**: AniList GraphQL API media tracking library.
- **MAL (MyAnimeList)**: MyAnimeList REST API media tracking library.

### Authenticated Connection
An official OAuth 2.0-backed profile connection granting full read/write access token privileges to synchronize watchlists and media status.

### Sandbox Connection
A lightweight, read-only profile connection authenticated by username alone. Designed for rapid offline testing, local exploration, and fallback runtimes without requiring live OAuth credentials.

### Route & View Resolution
The active navigation state mapping route identifiers (`dashboard`, `smartMatcher`, `parserSources`, `sandbox`, `vault`, `browser`, `settings`) to their corresponding Svelte view components and navigation metadata (labels, icons). Managed by a unified reactive `Router` module.

### Theme Resolution & Presets
The system-wide aesthetic state managing color scheme modes (`system`, `light`, `dark`), DaisyUI theme presets (e.g. `Dracula`, `Nord`, `Cupcake`, `Emerald`), system media query event synchronization, and DOM attribute updates via `ThemeManager`.

### Application Bootstrap
The centralized initialization sequence (`Setup.init()`) responsible for bootstrapping core service managers (`ThemeManager`, `UserManager`), restoring persisted user state, and setting up runtime listeners prior to UI mounting.

### Transport Seam
The network transport abstraction (`doApiCall`) wrapping Axios REST operations with standardized success/failure payload typing, `AbortSignal` cancellation propagation, and uniform error formatting.
