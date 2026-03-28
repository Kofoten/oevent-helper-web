package main

import (
	"fmt"
	"os"
)

type MinioSettings struct {
	User     string
	Password string
	Host     string
}

type Settings struct {
	Minio       MinioSettings
	RabbitMqUrl string
}

func readEnv() (*Settings, error) {
	minioUser, exists := os.LookupEnv("MINIO_USER")
	if !exists {
		return nil, fmt.Errorf("missing required environment variable: MINIO_USER")
	}

	minioPassword, exists := os.LookupEnv("MINIO_PASS")
	if !exists {
		return nil, fmt.Errorf("missing required environment variable: MINIO_PASS")
	}

	minioHost, exists := os.LookupEnv("MINIO_HOST")
	if !exists {
		return nil, fmt.Errorf("missing required environment variable: MINIO_HOST")
	}

	rabbitMqUrl, exists := os.LookupEnv("RABBITMQ_URL")
	if !exists {
		return nil, fmt.Errorf("missing required environment variable: RABBITMQ_URL")
	}

	return &Settings{
		Minio: MinioSettings{
			User:     minioUser,
			Password: minioPassword,
			Host:     minioHost,
		},
		RabbitMqUrl: rabbitMqUrl,
	}, nil
}
