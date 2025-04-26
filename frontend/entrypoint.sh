#!/bin/sh

# Inject runtime env vars into config.js
envsubst < /usr/share/nginx/html/config.js.template > /usr/share/nginx/html/config.js

# Start nginx and keep container running
exec nginx -g "daemon off;"