import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'WebArcade',
  description: 'Lightweight plugin platform for building native desktop applications with SolidJS and Rust',
  base: '/docs/',

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/docs/web_arcade_logo.png' }],
    ['meta', { name: 'theme-color', content: '#8b5cf6' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'WebArcade' }],
    ['meta', { property: 'og:description', content: 'Lightweight plugin platform for native desktop apps' }],
    ['meta', { property: 'og:image', content: '/docs/cover_1.png' }],
  ],

  themeConfig: {
    logo: '/web_arcade_logo.png',
    siteTitle: 'WebArcade',

    nav: [
      { text: 'Guide', link: '/getting-started/' },
      { text: 'Plugins', link: '/plugins/' },
      { text: 'API', link: '/api/' },
      { text: 'CLI', link: '/cli/' },
      { text: 'Examples', link: '/examples/' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/getting-started/' },
          { text: 'Installation', link: '/getting-started/installation' },
          { text: 'Quick Start', link: '/getting-started/quick-start' }
        ]
      },
      {
        text: 'Guide',
        items: [
          { text: 'Overview', link: '/guide/' },
          { text: 'Plugin Modes', link: '/guide/plugin-modes' },
          { text: 'App Configuration', link: '/guide/app-configuration' },
          { text: 'Project Structure', link: '/guide/project-structure' },
          { text: 'Plugin Configuration', link: '/guide/plugin-config' },
          { text: 'Theming', link: '/guide/theming' },
          { text: 'Error Handling', link: '/guide/error-handling' },
          { text: 'Technical Internals', link: '/guide/internals' }
        ]
      },
      {
        text: 'Plugins',
        items: [
          { text: 'Overview', link: '/plugins/' },
          { text: 'Creating Plugins', link: '/plugins/creating-plugins' },
          { text: 'Plugin Lifecycle', link: '/plugins/plugin-lifecycle' },
          { text: 'Panel System', link: '/plugins/panels' },
          { text: 'Toolbar & Menus', link: '/plugins/toolbar-menu' },
          { text: 'Shared Components', link: '/plugins/shared-components' }
        ]
      },
      {
        text: 'API Reference',
        items: [
          { text: 'Overview', link: '/api/' },
          { text: 'Plugin API', link: '/api/plugin-api' },
          { text: 'Bridge API', link: '/api/bridge-api' },
          { text: 'HTTP API', link: '/api/http-api' },
          { text: 'Rust API', link: '/api/rust-api' },
          { text: 'Window & Desktop API', link: '/api/window-api' }
        ]
      },
      {
        text: 'CLI',
        items: [
          { text: 'Commands', link: '/cli/' }
        ]
      },
      {
        text: 'Examples',
        items: [
          { text: 'Overview', link: '/examples/' },
          { text: 'Hello World', link: '/examples/hello-world' },
          { text: 'Full-Stack Plugin', link: '/examples/full-stack' }
        ]
      },
      {
        text: 'Resources',
        items: [
          { text: 'Troubleshooting', link: '/troubleshooting' },
          { text: 'Contributing', link: '/contributing' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/warcade/core' }
    ],

    search: {
      provider: 'local'
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 WebArcade'
    },

    editLink: {
      pattern: 'https://github.com/warcade/core/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    }
  }
})
