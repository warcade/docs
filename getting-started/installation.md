# Installation

This guide walks you through installing everything you need to develop WebArcade applications.

## Overview

You need to install three things:

| Tool | Purpose | Required |
|------|---------|----------|
| **Rust** | Compiles the desktop runtime and plugin backends | Yes |
| **Bun** | Builds the frontend JavaScript | Yes |
| **WebArcade CLI** | Creates and manages projects | Yes |

## Step 1: Install Rust

Rust is a programming language that WebArcade uses for the desktop runtime.

### Windows

Open PowerShell and run:

```powershell
winget install Rustlang.Rustup
```

Or download the installer from [rustup.rs](https://rustup.rs/).

### macOS

Open Terminal and run:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Follow the prompts and select the default installation.

### Linux

Open a terminal and run:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Verify Rust Installation

After installation, restart your terminal and run:

```bash
rustc --version
```

You should see something like:

```
rustc 1.75.0 (82e1608df 2023-12-21)
```

If you see "command not found", try restarting your terminal or computer.

## Step 2: Install Bun

Bun is a fast JavaScript runtime used to build the frontend.

### Windows

Open PowerShell and run:

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

### macOS

Open Terminal and run:

```bash
curl -fsSL https://bun.sh/install | bash
```

### Linux

Open a terminal and run:

```bash
curl -fsSL https://bun.sh/install | bash
```

### Verify Bun Installation

After installation, restart your terminal and run:

```bash
bun --version
```

You should see something like:

```
1.0.25
```

## Step 3: Install WebArcade CLI

Now install the WebArcade command-line tool:

```bash
cargo install webarcade
```

This downloads and compiles the CLI. It may take a few minutes on first install.

### Verify CLI Installation

```bash
webarcade --version
```

You should see:

```
webarcade 0.1.0
```

## Step 4: Install WebView (Linux Only)

On Linux, you need to install WebKitGTK manually.

### Ubuntu / Debian

```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev
```

### Fedora

```bash
sudo dnf install webkit2gtk4.1-devel
```

### Arch Linux

```bash
sudo pacman -S webkit2gtk-4.1
```

### Other Distributions

Search your package manager for `webkit2gtk` or `webkitgtk`.

## Troubleshooting

### "cargo: command not found"

Rust wasn't added to your PATH. Try:

1. Restart your terminal
2. If that doesn't work, add Rust to your PATH manually:

**Windows (PowerShell):**
```powershell
$env:Path += ";$env:USERPROFILE\.cargo\bin"
```

**macOS/Linux:**
```bash
export PATH="$HOME/.cargo/bin:$PATH"
```

Add this line to your `~/.bashrc` or `~/.zshrc` to make it permanent.

### "bun: command not found"

Bun wasn't added to your PATH. Try:

1. Restart your terminal
2. If that doesn't work, add Bun to your PATH:

**macOS/Linux:**
```bash
export PATH="$HOME/.bun/bin:$PATH"
```

### Windows: "WebView2 not found"

WebView2 is usually pre-installed on Windows 10/11. If not:

1. Download from [Microsoft's WebView2 page](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)
2. Install the "Evergreen Bootstrapper"

### Linux: Build Errors

If you get build errors about missing libraries, install these dependencies:

**Ubuntu/Debian:**
```bash
sudo apt install build-essential libgtk-3-dev libsoup-3.0-dev
```

**Fedora:**
```bash
sudo dnf install gtk3-devel libsoup3-devel
```

### Compilation is Slow

First-time compilation can take several minutes. Subsequent builds are much faster because Rust caches compiled dependencies.

## Checking Your Setup

Run this command to verify everything is installed:

```bash
rustc --version && bun --version && webarcade --version
```

You should see three version numbers. If any command fails, revisit the installation steps for that tool.

## Next Steps

Everything installed? Let's [create your first app](/getting-started/quick-start)!
