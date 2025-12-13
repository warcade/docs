---
layout: home

hero:
  name: WebArcade
  text: Platform for Building Native Desktop Apps
  tagline: Build lightweight desktop applications with SolidJS and Rust. ~2.5 MB binary, dynamic plugins, zero overhead.
  image:
    src: /web_arcade_logo.png
    alt: WebArcade Logo
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started/
    - theme: alt
      text: View on GitHub
      link: https://github.com/warcade/core

features:
  - icon: ⚡
    title: Lightweight
    details: ~2.5 MB binary using system WebView. No Chromium download required.
  - icon: 🔌
    title: Dynamic Plugins
    details: Load plugins at runtime from JS/DLL files. Users can add or remove plugins after installation.
  - icon: 🦀
    title: Rust Backend
    details: Optional Rust backend per plugin for performance-critical tasks. Full async support with Tokio.
  - icon: 🎨
    title: Panel-Based UI
    details: Unified panel system with viewport, sidebars, toolbar, and menus. SolidJS reactive components.
  - icon: 🔗
    title: Cross-Plugin Communication
    details: Services, pub/sub messaging, and shared reactive store for seamless plugin integration.
  - icon: 📦
    title: Easy Distribution
    details: Single executable or plugin folder. No npm, no compilation required for end users.
---

<style>
.quick-start {
  margin: 4rem auto;
  max-width: 800px;
  padding: 0 24px;
}

.quick-start h2 {
  text-align: center;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.architecture {
  margin: 4rem auto;
  max-width: 900px;
  padding: 0 24px;
}

.architecture h2 {
  text-align: center;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.architecture pre {
  background: var(--vp-c-bg-soft);
  padding: 1.5rem;
  border-radius: 12px;
  overflow-x: auto;
  font-size: 0.85rem;
  line-height: 1.6;
}
</style>

<HeroSlideshow />

<div class="quick-start">

## Quick Start

```bash
# Install the CLI
cargo install webarcade

# Create a new project
webarcade init my-app
cd my-app

# Run in development mode
webarcade dev
```

</div>

<div class="architecture">

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     WebArcade Runtime                       │
│                        (~2.5 MB)                            │
├─────────────────────────────────────────────────────────────┤
│  Rust Binary (tao + wry)                                    │
│  ├── Borderless window + IPC                                │
│  ├── Bridge server (HTTP localhost:3001)                    │
│  ├── WebSocket server (localhost:3002)                      │
│  └── Dynamic DLL loader                                     │
├─────────────────────────────────────────────────────────────┤
│  SolidJS Frontend (served from localhost:3000)              │
│  ├── Plugin API + Panel Store                               │
│  ├── Plugin Bridge (services, pub/sub, shared store)        │
│  └── Unified layout system                                  │
├─────────────────────────────────────────────────────────────┤
│  Plugins (loaded at runtime from app/plugins/)              │
│  ├── plugin.js   → UI components                            │
│  └── plugin.dll  → Rust backend (optional)                  │
└─────────────────────────────────────────────────────────────┘
```

</div>
