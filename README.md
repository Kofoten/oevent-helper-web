# OEvent Helper Web

**OEvent Helper** is a web-based hub designed to host various scripts and applications for managing orienteering events. The project features a unique architecture that combines a Go-based backend serving the different tools via HTMX using an island architecture for the self-sustaining tools, making the initial page load faster.

## Architecture & Design

Instead of a traditional monolithic frontend, OEvent Helper uses a modular "island architecture" to manage complexity and performance:

- **Go Backend & HTMX**: The Go server manages the main application shell and serves individual tool fragments as HTML "islands". HTMX is used to dynamically swap these fragments into the workspace without full page reloads.
- **Lazy-Loaded Runtimes**: Heavy runtimes, such as the .NET WebAssembly engine, are only initialized when their specific tool is loaded. This keeps the initial hub footprint extremely small.
- **Decoupled Tools**: Each tool is a self-contained unit with its own UI stack (e.g., Svelte) and logic engine (e.g., C# Wasm), allowing for diverse technologies to coexist within the same hub.
- **Unified Styling**: A central CSS system ensures that while tools are technically isolated, they maintain a consistent visual language, including shared support for light and dark modes.

## Available Tools

### 1. Course Prioritizer

The **Course Prioritizer** is a high-performance tool that processes IOF 3.0 XML files to determine the most efficient course prioritization order for test running the courses before a major event. The source code for the engine of this tool can be found in the following repository: [https://github.com/Kofoten/oevent-course-helper](https://github.com/Kofoten/oevent-course-helper)

#### Technical Stack

- **Logic Engine**: Built with **C# (.NET 10)** and compiled to **WebAssembly (Wasm)**. This allows complex prioritization algorithms to run at near-native speeds directly in the browser.
- **Frontend UI**: Developed using **Svelte 5** and **Vite** for a reactive, modern user interface.
- **Integration**: Loaded as an "island" via a dedicated HTML fragment that initializes the .NET runtime only when the tool is accessed.

## Deployment & Infrastructure

The project is designed for modern, containerized environments with a focus on minimal overhead:

- **Minimal Docker Image**: The application is compiled into a self-contained binary and deployed using a **Scratch** Docker image, resulting in a tiny attack surface and footprint.
- **Kubernetes Ready**: Includes manifests for a Pod and Service deployment within a `web-servers` namespace, exposing the hub via a NodePort.
- **CI/CD Friendly**: A standard `Makefile` orchestrates the multi-stage build process, from compiling C# Wasm to building the final Go binary.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
