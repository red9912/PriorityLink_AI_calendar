# Priority Link AI Calendar

Priority Link is a calendar application with a conversational assistant. The React frontend displays a calendar, category filters, and a chat with the "Time Mate" bot; the Node/Express backend exposes commitment APIs and forwards chat messages to Rasa; Rasa interprets user messages and creates new commitments through the backend APIs.

## Features

- initial habit setup through a chatbot;
- day/week/month calendar based on DevExtreme Scheduler;
- commitment filtering by category: `All`, `Work`, `Study`, `Free-time`;
- list of commitments for the selected day;
- commitment creation through the Time Mate conversation;
- frontend support for weekly and monthly recurrences;
- REST APIs for reading, creating, updating, and deleting commitments.

## Stack

### Frontend

- React 18
- Vite
- React Bootstrap / Bootstrap
- DevExtreme React Scheduler
- React Chatbot Kit
- RRule

### Backend

- Node.js
- Express
- Prisma
- PostgreSQL
- Axios

### Chatbot

- Rasa
- Rasa SDK custom actions
- REST channel on `localhost:5005`
- action server on `localhost:5055`

## Project Structure

```text
.
+-- be-priority-link/
|   +-- index.js                 # Express server and API routing
|   +-- dao.js                   # data access through Prisma
|   +-- prisma/
|   |   +-- schema.prisma        # User/Commitment schema
|   |   +-- migrations/          # database migrations
|   +-- time-mate/
|       +-- actions/actions.py   # Rasa custom actions
|       +-- data/                # NLU, stories, rules
|       +-- domain.yml           # intents, responses, and actions
|       +-- endpoints.yml        # Rasa action endpoint
|       +-- models/              # pre-trained Rasa models
+-- fe-priority-link/
|   +-- src/
|   |   +-- API.js               # frontend API client
|   |   +-- App.jsx              # switch between initial setup and calendar
|   |   +-- components/          # calendar, chatbot, header
|   |   +-- pages/               # application pages
|   +-- vite.config.js
+-- start-windows.bat
+-- start-linux.sh
+-- start-mac.sh
```

## Requirements

- Node.js and npm
- PostgreSQL
- Python with Rasa and Rasa SDK installed
- Prisma CLI, already included as a backend dev dependency
- `nodemon` if you want to use the startup scripts as they are

## Database Configuration

The backend uses Prisma with PostgreSQL. The connection string is read from the `DB_URL` environment variable.

Example:

```bash
DB_URL="postgresql://USER:PASSWORD@localhost:5432/priority_link"
```

The Prisma schema defines:

- `User`: a user with name, surname, study/work information, and commitments;
- `Commitment`: a commitment with name, start time, end time, optional recurrence, category, and user reference.

Apply the migrations from the backend directory:

```bash
cd be-priority-link
npm install
npx prisma migrate dev
```

Note: the Rasa custom actions create commitments with `userId: 1`, so the database must contain a user with `id = 1`.

## Manual Startup

Open separate terminals.

### 1. Rasa Action Server

```bash
cd be-priority-link/time-mate
rasa run actions
```

### 2. Rasa Server

Windows:

```bash
cd be-priority-link/time-mate
rasa run --model models\20240122-173845-slim-phantom.tar.gz --enable-api --cors "*"
```

macOS/Linux:

```bash
cd be-priority-link/time-mate
rasa run --model models/20240122-173845-slim-phantom.tar.gz --enable-api --cors "*"
```

The frontend/backend expect Rasa at:

```text
http://localhost:5005/webhooks/rest/webhook/
```

### 3. Express Backend

```bash
cd be-priority-link
npm install
node index.js
```

The backend starts at:

```text
http://localhost:3001
```

### 4. Vite Frontend

```bash
cd fe-priority-link
npm install
npm run dev
```

The Vite frontend is normally available at:

```text
http://localhost:5173
```

## Startup Scripts

Root-level scripts are available to start the main processes:

- `start-windows.bat`
- `start-linux.sh`
- `start-mac.sh`

The scripts start:

- Rasa action server;
- Rasa server with a pre-trained model;
- Node backend;
- Vite frontend.

Note: the scripts use `nodemon run` for the backend. If `nodemon` is not installed globally, use `node index.js` or install/configure `nodemon`.

## Backend API

Base URL:

```text
http://localhost:3001
```

### `GET /api/commitments`

Returns all commitments ordered by ascending `startDateTime`.

### `POST /api/newcommitments`

Creates one or more commitments. The expected body is an array.

```json
[
  {
    "name": "Meeting",
    "startDateTime": "2024-01-31T09:00:00.000Z",
    "endDateTime": "2024-01-31T11:00:00.000Z",
    "recurrency": "WEEKLY",
    "category": "Work",
    "userId": 1
  }
]
```

### `POST /api/updatecommitment/:id`

Updates a commitment.

```json
{
  "updatedData": {
    "name": "New name",
    "category": "Study"
  }
}
```

### `DELETE /api/deletecommitment/:id`

Deletes a commitment.

### `POST /api/sendMessage`

Forwards the message to Rasa's REST webhook.

```json
{
  "message": "Start conversation"
}
```

## Chatbot Flow

The frontend initially sends:

```text
Start habit setting
```

Rasa guides the user through habit collection:

1. work;
2. study;
3. free time;
4. meals;
5. priorities.

When Rasa responds:

```text
I think we're done!
```

the frontend switches to the calendar page. On the calendar page, the bot starts with:

```text
Start conversation
```

When a custom action creates a new task and responds:

```text
Task inserted!
```

the frontend reloads commitments from the backend.

## Frontend Commitment Format

Commitments received from the backend are converted into DevExtreme Scheduler-compatible objects:

- `category` becomes `text`;
- `name` becomes `description`;
- `startDateTime` becomes `startDate`;
- `endDateTime` becomes `endDate`;
- `category` is mapped to `type`:
  - `Work` -> `1`;
  - `Study` -> `2`;
  - `Free-time` -> `3`;
- `recurrency` is mapped to an RRULE when it is `WEEKLY` or `MONTHLY`.

## Operational Notes

- Backend CORS allows requests from the frontend at `http://localhost:5173`.
- The backend listens on `3001`.
- Rasa listens on `5005`.
- The Rasa action server listens on `5055`.
- Custom actions calculate dates from the nearest matching weekday.
- The categories recognized by the frontend are `Work`, `Study`, and `Free-time`.
- The frontend client contains a `createNewCommitment` function, but it points to `api/newcommitment}`; the actual backend endpoint is `api/newcommitments` and it expects an array.

## Tests and Useful Files

- `be-priority-link/queries_api.http` contains sample API calls.
- `be-priority-link/time-mate/tests/test_stories.yml` contains sample Rasa story tests.
- `be-priority-link/time-mate/test_answers.txt` contains sample conversations and REST webhook examples.

