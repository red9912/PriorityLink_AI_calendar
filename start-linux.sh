#!/bin/bash

# Set absolute paths
BASE_DIR="$PWD"
BE_DIR="$BASE_DIR/be-priority-link"
FE_DIR="$BASE_DIR/fe-priority-link"
RASA_DIR="$BE_DIR/time-mate"
MODEL_PATH="$RASA_DIR/models/20240122-173845-slim-phantom.tar.gz"

# Start the Rasa actions server
gnome-terminal --tab --title="Rasa Actions" -- bash -c "cd $RASA_DIR && rasa run actions"

# Start the Rasa server with the specified model
gnome-terminal --tab --title="Rasa Server" -- bash -c "cd $RASA_DIR && rasa run --model $MODEL_PATH --enable-api --cors \"*\""

# Start nodemon
gnome-terminal --tab --title="Nodemon" -- bash -c "cd $BE_DIR && npm install && nodemon run"

# Start npm dev
gnome-terminal --tab --title="npm Dev" -- bash -c "cd $FE_DIR && npm install && npm run dev"
