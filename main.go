package main

//go:generate go run build.go

import (
	"bytes"
	"flag"
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

var (
	assetsDir    string
	viewsDir     string
	templatesDir string
)

type AppTemplates struct {
	Layout  *template.Template
	Welcome *template.Template
	Error   *template.Template
}

var templates AppTemplates

func init() {
	flag.StringVar(&assetsDir, "assets", "./assets", "Path to the assets directory")
	flag.StringVar(&viewsDir, "views", "./views", "Path to the views directory")
	flag.StringVar(&templatesDir, "templates", "./templates", "Path to the templates directory")
	flag.Parse()
}

func main() {
	templates = AppTemplates{
		Layout:  template.Must(template.ParseFiles("index.html")),
		Welcome: template.Must(template.ParseFiles(filepath.Join(templatesDir, "welcome.html"))),
		Error:   template.Must(template.ParseFiles(filepath.Join(templatesDir, "error.html"))),
	}

	fs := http.FileServer(http.Dir(assetsDir))
	http.Handle("/assets/", http.StripPrefix("/assets/", fs))

	http.HandleFunc("/", requestHandler)

	log.Println("OEvent Helper running at http://localhost:8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err)
	}
}

func requestHandler(w http.ResponseWriter, r *http.Request) {
	isHTMX := r.Header.Get("HX-Request") == "true"
	urlPath := r.URL.Path

	if urlPath == "/" {
		if isHTMX {
			templates.Welcome.Execute(w, nil)
			return
		}

		var buf bytes.Buffer
		templates.Welcome.Execute(&buf, nil)
		templates.Layout.Execute(w, template.HTML(buf.String()))
		return
	}

	cleanPath := filepath.Clean(urlPath)
	if strings.Contains(cleanPath, "..") {
		serveError(w, isHTMX, http.StatusBadRequest, "Invalid path")
		return
	}

	viewPath := filepath.Join(viewsDir, cleanPath+".html")

	if _, err := os.Stat(viewPath); os.IsNotExist(err) {
		serveError(w, isHTMX, http.StatusNotFound, "This section is either missing or under construction.")
		return
	}

	fragmentBytes, err := os.ReadFile(viewPath)
	if err != nil {
		serveError(w, isHTMX, http.StatusInternalServerError, "Error reading view file")
		return
	}

	if isHTMX {
		w.Write(fragmentBytes)
		return
	}

	templates.Layout.Execute(w, template.HTML(fragmentBytes))
}

func serveError(w http.ResponseWriter, isHTMX bool, code int, message string) {
	errData := struct {
		Code    int
		Title   string
		Message string
	}{
		Code:    code,
		Title:   http.StatusText(code),
		Message: message,
	}

	w.WriteHeader(code)

	if isHTMX {
		templates.Error.Execute(w, errData)
	} else {
		var buf bytes.Buffer
		templates.Error.Execute(&buf, errData)
		templates.Layout.Execute(w, template.HTML(buf.String()))
	}
}
