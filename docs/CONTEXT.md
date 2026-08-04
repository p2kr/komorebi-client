# Domain Glossary & Context

This document establishes the authoritative domain vocabulary for **Komorebi**.

## Domain Concepts

### User Profile
A registered identity within Komorebi that links client state to an external media provider account. Each user profile contains a unique identifier (`id`), username, provider type, optional avatar URL, authentication token (if authenticated), and timestamp metadata.

### Media Provider
An external third-party media tracking service integrated with Komorebi. Supported providers:
- **AniList**: AniList GraphQL API media tracking library.
- **MAL (MyAnimeList)**: MyAnimeList REST API media tracking library.

### Authenticated Connection
An official OAuth 2.0-backed profile connection granting full read/write access token privileges to synchronize watchlists and media status.

### Sandbox Connection
A lightweight, read-only profile connection authenticated by username alone. Designed for rapid offline testing, local exploration, and fallback runtimes without requiring live OAuth credentials.

### Route & View Resolution
The active navigation state mapping a route identifier (`RouteId`) to its corresponding Svelte view component and metadata (labels, icons). Managed by a unified reactive router module.

