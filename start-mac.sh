#!/bin/bash

# Set absolute paths
BASE_DIR="$PWD"
BE_DIR="$BASE_DIR/be-priority-link"
FE_DIR="$BASE_DIR/fe-priority-link"
RASA_DIR="$BE_DIR/time-mate"
MODEL_PATH="$RASA_DIR/models/20240213-103314-advanced-monument.tar.gz"

# Start the Rasa actions server
osascript -e "tell app \"Terminal\" to do script \"cd $RASA_DIR && rasa run actions\""

# Start the Rasa server with the specified model
osascript -e "tell app \"Terminal\" to do script \"cd $RASA_DIR && rasa run --model $MODEL_PATH --enable-api --cors \\\"*\\\"\""

# Start nodemon
osascript -e "tell app \"Terminal\" to do script \"cd $BE_DIR && npm install && nodemon run\""

# Start npm dev
osascript -e "tell app \"Terminal\" to do script \"cd $FE_DIR && npm install && npm run dev\""