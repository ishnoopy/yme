#!/bin/bash

while [[ $# -gt 0 ]]; do
  case $1 in
    --command)
      COMMAND="$2"
      shift 2
      ;;
    --env)
      ENV_FILE="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: sh run.sh --command <command> --env <env-file>"
      exit 1
      ;;
  esac
done

if [ -z "$COMMAND" ]; then
  echo "No command provided. Use --command to specify a command."
  exit 1
fi
if [ -z "$ENV_FILE" ]; then
  echo "No env file provided. Use --env to specify an env file."
  exit 1
fi


if [ "$COMMAND" = "up" ]; then
  docker compose -f backend/docker-compose.yaml --env-file backend/$ENV_FILE up -d
  docker compose -f frontend/docker-compose.yaml --env-file frontend/$ENV_FILE up -d
  echo "Frontend and backend are up and running."
elif [ "$COMMAND" = "down" ]; then
  docker compose -f backend/docker-compose.yaml --env-file backend/$ENV_FILE down
  docker compose -f frontend/docker-compose.yaml --env-file frontend/$ENV_FILE down
  echo "Removed frontend and backend containers."
else
  echo "Command '$COMMAND' has been executed on frontend and backend."
fi