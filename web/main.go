package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
)

type JobMessage struct {
	JobID      string `json:"job_id"`
	BucketName string `json:"bucket_name"`
	ObjectName string `json:"object_name"`
	Timestamp  string `json:"timestamp"`
}

func main() {
	settings, err := readEnv()
	if err != nil {
		log.Fatalln("Failed to read environment:", err)
	}

	ctx := context.Background()
	bucketName := "prioritize-data"
	queueName := "prioritize-jobs"

	minioClient, err := initMinIO(ctx, settings.Minio, bucketName)
	if err != nil {
		log.Fatalln("MinIO setup failed:", err)
	}

	rabbitConn, rabbitCh, rabbitQueue, err := initRabbitMQ(settings.RabbitMqUrl, queueName)
	if err != nil {
		log.Fatalln("RabbitMQ setup failed:", err)
	}

	defer rabbitConn.Close()
	defer rabbitCh.Close()

	app := &App{
		MinioClient: minioClient,
		RabbitChan:  rabbitCh,
		RabbitQueue: rabbitQueue,
		BucketName:  bucketName,
	}

	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	http.HandleFunc("/", app.ServeUI)
	http.HandleFunc("/submit-prioritize-job", app.SubmitJob)

	fmt.Println("🚀 Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
