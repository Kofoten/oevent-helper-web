package main

import (
	"context"
	"log"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	amqp "github.com/rabbitmq/amqp091-go"
)

func initMinIO(
	ctx context.Context,
	settings MinioSettings,
	bucketName string,
) (*minio.Client, error) {
	client, err := minio.New(settings.Host, &minio.Options{
		Creds:  credentials.NewStaticV4(settings.User, settings.Password, ""),
		Secure: false,
	})

	if err != nil {
		return nil, err
	}

	err = client.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
	if err != nil {
		exists, errBucketExists := client.BucketExists(ctx, bucketName)
		if errBucketExists != nil && exists {
			log.Printf("Bucket '%s' ready\n", bucketName)
		} else {
			return nil, err
		}
	}

	return client, nil
}

func initRabbitMQ(
	rabbitMqUrl string,
	queueName string,
) (*amqp.Connection, *amqp.Channel, amqp.Queue, error) {
	conn, err := amqp.Dial(rabbitMqUrl)
	if err != nil {
		return nil, nil, amqp.Queue{}, err
	}

	ch, err := conn.Channel()
	if err != nil {
		return nil, nil, amqp.Queue{}, err
	}

	q, err := ch.QueueDeclare(queueName, true, false, false, false, nil)
	if err != nil {
		return nil, nil, amqp.Queue{}, err
	}

	log.Printf("Queue '%s' ready\n", q.Name)
	return conn, ch, q, nil
}
