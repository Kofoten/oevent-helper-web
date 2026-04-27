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
	targetDir := "dev"

	fmt.Printf("Cleaning and preparing hardcoded staging directory: %s\n", targetDir)
	os.RemoveAll(targetDir)
	os.MkdirAll(targetDir, 0755)

	fmt.Println("Copy app files...")
	if err := copyAppFiles(targetDir); err != nil {
		log.Fatalf("Failed to copy app files: %v", err)
	}

	fmt.Println("Building the Course Prioritizer tool...")
	if err := buildCoursePrioritizer(targetDir); err != nil {
		log.Fatalf("Failed to build course prioritizer: %v", err)
	}
}

func copyAppFiles(targetDir string) error {
	folders := []string{"assets", "views", "templates"}

	for _, folder := range folders {
		err := filepath.WalkDir(folder, func(path string, d fs.DirEntry, err error) error {
			if err != nil {
				return err
			}

			destPath := filepath.Join(targetDir, path)
			if d.IsDir() {
				return os.MkdirAll(destPath, 0755)
			}
			return copyFile(path, destPath)
		})
		if err != nil && !os.IsNotExist(err) {
			return err
		}
	}
	return nil
}

func buildCoursePrioritizer(targetDir string) error {
	fmt.Println("Building WebAssembly project for the Course Prioritizer tool (Release mode)...")

	projectPath := filepath.Join("tools", "course-prioritizer", "OEventCourseHelper.Wasm", "OEventCourseHelper.Wasm.csproj")
	publishDir := filepath.Join("tools", "course-prioritizer", "OEventCourseHelper.Wasm", "bin", "Release", "net10.0", "publish", "wwwroot")
	assetsDir := filepath.Join(targetDir, "views", "course-prioritizer")

	fmt.Println("Wiping old .NET publish directory...")
	os.RemoveAll(publishDir)

	cmd := exec.Command("dotnet", "publish", projectPath, "-c", "Release")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		return err
	}

	os.MkdirAll(assetsDir, 0755)
	indexRegex := regexp.MustCompile(`^index\.html(\.br|\.gz)?$`)

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

		return copyFile(path, destPath)
	})

	if err != nil {
		return err
	}

	fmt.Println("Build complete! Assets are ready.")
	return nil
}

func copyFile(src, dst string) error {
	sourceFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer sourceFile.Close()

	os.MkdirAll(filepath.Dir(dst), 0755)
	destFile, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer destFile.Close()

	_, err = io.Copy(destFile, sourceFile)
	return err
}
