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

## Motivation & Implementation

I first wrote the core engine as a CLI in C# ([OEventCourseHelper](https://github.com/Kofoten/oevent-course-helper)). However I wanted this tool to be easily accessible to anyone in the orienteering world, not just the tech savvy people. This provided me with the perfect opportunity to try out the Go + HTMX stack that I have wanted to try for a while.

Since this was my first time trying these out, the initial architecture was a Go + HTMX frontend with queues and automatically scaling worker nodes in a k8s cluster executing the CLI on the uploaded files. This worked, but I quickly abandoned it for two reasons:

1. **Security:** I don't want to pass potentially malicious files and filenames to a CLI on a server. There are a lot of ways to mitigate these security issues, but the best way is to not deal with it at all.
2. **Privacy:** The courses for an event are a closely guarded secret by the organizer up to the day of the event. As an organizer, you don't want to upload these files to an untrusted server.

I used AI to bounce ideas about client-side architectures, and it suggested compiling the C# engine to WebAssembly. I had never done that before, so I saw it as a challenge. However, this meant I needed to load the entire .NET runtime into the browser. I didn't want to punish the user with that payload if they weren't actively using the tool, which led me to an "island architecture" to keep initial page loads incredibly fast.

I then tried to abuse HTMX and write a lot of annoying JavaScript to trick HTMX into thinking a request was happening for the client-side tool. This made me very angry at myself, so I looked for alternatives that were not React or Vue, I did not want to add even more bloat after deciding to use C# compiled to WebAssembly and the use of any such framework would also defeat the entire purpouse of the Go + HTMX stack. I discovered Svelte and understood that it is a static compiler rather than a heavy client-side renderer. I got really intrigued by that, and since I had never used Svelte before, I thought it'd be a great opportunity to learn it as well.

This ultimately made the project more of a build-orchestration puzzle than actual coding, but the result speaks for itself and I love it. It's unbloated, fast, and runs in a `scratch` Docker container, which is a massive win for speed, security, and memory usage.

During my first real test, I realized I wanted to share my prioritization results with others. Instead of spinning up a database (which would be a violation against all the work I just did to make this 100% client-side) I devised a way to compress and encode the final result directly into a URL query parameter.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
