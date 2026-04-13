//go:build ignore

package main

import (
	"fmt"
	"io"
	"io/fs"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
)

func main() {
	fmt.Println("Building the Course Prioritizer tool...")
	err := buildCoursePrioritizer()
	if err != nil {
		return
	}
}

func buildCoursePrioritizer() error {
	fmt.Println("Building WebAssembly project for the Course Prioritizer tool (Release mode)...")

	projectPath := filepath.Join("tools", "course-prioritizer", "OEventCourseHelper.Wasm", "OEventCourseHelper.Wasm.csproj")
	publishDir := filepath.Join("tools", "course-prioritizer", "OEventCourseHelper.Wasm", "bin", "Release", "net10.0", "publish", "wwwroot")
	assetsDir := filepath.Join("assets", "course-prioritizer")

	cmd := exec.Command("dotnet", "publish", projectPath, "-c", "Release")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		log.Fatalf("Dotnet publish failed: %v", err)
		return err
	}

	fmt.Println("Sweeping old assets...")
	if err := os.RemoveAll(assetsDir); err != nil {
		log.Fatalf("Failed to clean assets directory: %v", err)
		return err
	}

	if err := os.MkdirAll(assetsDir, 0755); err != nil {
		log.Fatalf("Failed to recreate assets directory: %v", err)
		return err
	}

	indexRegex := regexp.MustCompile(`^index\.html\.?(br|gz)?$`)

	fmt.Printf("Copying output to %s (excluding index.html)...\n", assetsDir)
	err := filepath.WalkDir(publishDir, func(path string, d fs.DirEntry, err error) error {
		if err != nil || path == publishDir {
			return err
		}

		relPath, _ := filepath.Rel(publishDir, path)
		destPath := filepath.Join(assetsDir, relPath)

		if d.IsDir() {
			return os.MkdirAll(destPath, 0755)
		}

		if indexRegex.MatchString(d.Name()) {
			return nil
		}

		src, err := os.Open(path)
		if err != nil {
			return err
		}
		defer src.Close()

		dst, err := os.Create(destPath)
		if err != nil {
			return err
		}
		defer dst.Close()

		_, err = io.Copy(dst, src)
		return err
	})

	if err != nil {
		log.Fatalf("Failed to copy files: %v", err)
		return err
	}

	fmt.Println("Build complete! Assets are ready.")
	return nil
}
