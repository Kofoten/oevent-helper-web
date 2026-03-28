package main

import (
	"context"
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/minio/minio-go/v7"
	amqp "github.com/rabbitmq/amqp091-go"
)

type JobMessage struct {
	JobID      string `json:"job_id"`
	BucketName string `json:"bucket_name"`
	ObjectName string `json:"object_name"`
	Timestamp  string `json:"timestamp"`
}

type App struct {
	MinioClient *minio.Client
	RabbitChan  *amqp.Channel
	RabbitQueue amqp.Queue
	BucketName  string
	Context     context.Context
}

func (app *App) ServeUI(w http.ResponseWriter, r *http.Request) {
	template.Must(template.ParseFiles("index.html")).Execute(w, nil)
}

func (app *App) SubmitJob(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		http.Error(w, "Failed to parse form", http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("xml_file")
	if err != nil {
		http.Error(w, "Failed to get file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	jobID := uuid.New().String()
	info, err := app.MinioClient.PutObject(app.Context, app.BucketName, header.Filename, file, header.Size, minio.PutObjectOptions{
		ContentType: "application/xml",
	})

	if err != nil {
		log.Printf("Failed to upload to MinIO: %v", err)
		http.Error(w, "Failed to upload to MinIO", http.StatusInternalServerError)
		return
	}

	msg := JobMessage{
		JobID:      jobID,
		BucketName: app.BucketName,
		ObjectName: header.Filename,
		Timestamp:  time.Now().Format(time.RFC3339),
	}

	body, err := json.Marshal(msg)
	if err != nil {
		log.Printf("Failed to marshal JSON: %v", err)
		http.Error(w, "Failed to create job payload", http.StatusInternalServerError)
		return
	}

	err = app.RabbitChan.PublishWithContext(r.Context(),
		"",
		app.RabbitQueue.Name,
		false,
		false,
		amqp.Publishing{
			DeliveryMode: amqp.Persistent,
			ContentType:  "application/json",
			Body:         body,
		})

	if err != nil {
		log.Printf("RabbitMQ publish failed: %v", err)
		http.Error(w, "Failed to queue job", http.StatusInternalServerError)
		return
	}

	htmlSnippet := fmt.Sprintf(`
			<div style="background: #d4edda; color: #155724; padding: 1rem; border-radius: 5px;">
				<h3>Processing %s</h3>
				<p>Size: %d bytes</p>
			</div>
		`, header.Filename, info.Size)

	w.Header().Set("Content-Type", "text/html")
	w.Header().Set("Prioritize-JobID", jobID)
	w.Write([]byte(htmlSnippet))
}
