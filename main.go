package main

import (
	"html/template"
	"log"
	"net/http"
	"os"
)

var layout *template.Template

func main() {
	layout = template.Must(template.ParseFiles("index.html"))
	
	fs := http.FileServer(http.Dir("./assets"))
	http.Handle("/assets/", http.StripPrefix("/assets/", fs))

	http.HandleFunc("/", homeHandler)
	http.HandleFunc("/course-prioritizer", prioritizerHandler)

	log.Println("OEvent Helper running at http://localhost:8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err)
	}
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	
	renderView(w, r, "views/home.html")
}

func prioritizerHandler(w http.ResponseWriter, r *http.Request) {
	renderView(w, r, "views/course-prioritizer.html")
}

func renderView(w http.ResponseWriter, r *http.Request, viewPath string) {
	isHTMX := r.Header.Get("HX-Request") == "true"

	if isHTMX {
		http.ServeFile(w, r, viewPath)
		return
	}

	fragmentBytes, err := os.ReadFile(viewPath)
	if err != nil {
		http.Error(w, "View not found", http.StatusInternalServerError)
		return
	}

	err = layout.Execute(w, template.HTML(fragmentBytes))
	if err != nil {
		http.Error(w, "Template error", http.StatusInternalServerError)
	}
}