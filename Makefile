APP_NAME = oevent-helper-web

.PHONY: generate dev build

# 1. Generate assets (Compiles C# Wasm and copies to Go assets)
generate:
	go generate

# 2. Launch the server (Generates assets first, then runs)
dev: generate
	go run main.go

# 3. Build to an output directory (Generates assets first, then compiles Go binary)
build: generate
	go build -o bin/$(APP_NAME) .