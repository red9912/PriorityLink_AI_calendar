@echo off

rem Set absolute paths
set "BASE_DIR=%CD%"
set "BE_DIR=%BASE_DIR%\be-priority-link"
set "FE_DIR=%BASE_DIR%\fe-priority-link"
set "RASA_DIR=%BE_DIR%\time-mate"
set "MODEL_PATH=%RASA_DIR%\models/20240122-173845-slim-phantom.tar.gz"

rem Start the Rasa actions server
start cmd /k "cd %RASA_DIR% && rasa run actions"

rem Start the Rasa server with the specified model
start cmd /k "cd %RASA_DIR% && rasa run --model %MODEL_PATH% --enable-api --cors *"

rem Start nodemon
start cmd /k "cd %BE_DIR% && npm install && nodemon run"

rem Start npm dev
start cmd /k "cd %FE_DIR% && npm install && npm run dev"
