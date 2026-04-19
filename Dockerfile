FROM scratch

COPY bin/ /app/

WORKDIR /app

EXPOSE 8080

ENTRYPOINT [./oevent-helper-web]
