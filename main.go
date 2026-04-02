package main

import (
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

var layout *template.Template

func main() {
	layout = template.Must(template.ParseFiles("index.html"))
	
	fs := http.FileServer(http.Dir("./assets"))
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
		homeHTML := template.HTML(`<h2>Welcome to OEvent Helper</h2>
<p>A hub where you can use the scripts and applications i have made for solving theese issues.</p>
<p>Most of the solutions i have made are open source and most of theese projects are licensed under the MIT License. For example the code for this page is available at <a href="https://github.com/Kofoten/oevent-helper-web">https://github.com/Kofoten/oevent-helper-web</a></p>
<p>Select a module from the sidebar to initialize the workspace.</p>`)

		if isHTMX {
			w.Write([]byte(homeHTML))
			return
		}

		layout.Execute(w, homeHTML)
		return
	}
	
	cleanPath := filepath.Clean(urlPath)
	if strings.Contains(cleanPath, "..") {
		http.Error(w, "Invalid path", http.StatusBadRequest)
		return
	}

	viewPath := filepath.Join("views", cleanPath+".html")

	if _, err := os.Stat(viewPath); os.IsNotExist(err) {
		notFoundHTML := template.HTML(`<h2>404 - Not Found</h2>
<p>This section is either missing or under construction.</p>
<a href="#" class="cta-button" hx-get="/" hx-target="#workspace" hx-push-url="true">Return to Start</a>`)

		if isHTMX {
			w.Write([]byte(notFoundHTML))
		} else {
			w.WriteHeader(http.StatusNotFound)
			layout.Execute(w, notFoundHTML)
		}

		return
	}

	fragmentBytes, err := os.ReadFile(viewPath)
	if err != nil {
		http.Error(w, "Error reading view file", http.StatusInternalServerError)
		return
	}

	if isHTMX {
		w.Write(fragmentBytes)
		return
	}

	layout.Execute(w, template.HTML(fragmentBytes))
}
