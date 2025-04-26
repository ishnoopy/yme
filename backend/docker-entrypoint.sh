#!/bin/sh

# This script is used to sync the database and start the server.

echo "Waiting for database to be ready..."
sleep 3

echo "Generating Prisma client..."
npx prisma generate

echo "Running database sync"
npx prisma db push


echo "Starting API application"
node /runner/dist/index.js