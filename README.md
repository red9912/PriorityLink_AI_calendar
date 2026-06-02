# Priority Link AI Calendar

Priority Link e' un'applicazione calendario con assistente conversazionale. Il frontend React mostra un calendario, filtri per categoria e una chat con il bot "Time Mate"; il backend Node/Express espone le API sugli impegni e inoltra i messaggi a Rasa; Rasa interpreta le frasi dell'utente e crea nuovi impegni tramite le API backend.

## Funzionalita'

- configurazione iniziale delle abitudini tramite chatbot;
- calendario settimanale/giornaliero/mensile basato su DevExtreme Scheduler;
- filtro degli impegni per categoria: `All`, `Work`, `Study`, `Free-time`;
- lista degli impegni del giorno selezionato;
- creazione di impegni tramite conversazione con Time Mate;
- supporto a ricorrenze settimanali e mensili lato frontend;
- API REST per lettura, creazione, modifica ed eliminazione degli impegni.

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
- canale REST su `localhost:5005`
- action server su `localhost:5055`

## Struttura del progetto

```text
.
+-- be-priority-link/
|   +-- index.js                 # server Express e routing API
|   +-- dao.js                   # accesso dati tramite Prisma
|   +-- prisma/
|   |   +-- schema.prisma        # schema User/Commitment
|   |   +-- migrations/          # migrazioni database
|   +-- time-mate/
|       +-- actions/actions.py   # custom actions Rasa
|       +-- data/                # NLU, stories, rules
|       +-- domain.yml           # intents, responses e actions
|       +-- endpoints.yml        # action endpoint Rasa
|       +-- models/              # modelli Rasa gia' addestrati
+-- fe-priority-link/
|   +-- src/
|   |   +-- API.js               # client API frontend
|   |   +-- App.jsx              # switch tra setup iniziale e calendario
|   |   +-- components/          # calendario, chatbot, header
|   |   +-- pages/               # pagine applicative
|   +-- vite.config.js
+-- start-windows.bat
+-- start-linux.sh
+-- start-mac.sh
```

## Prerequisiti

- Node.js e npm
- PostgreSQL
- Python con Rasa e Rasa SDK installati
- Prisma CLI, gia' presente come dipendenza dev del backend
- `nodemon` se si vuole usare lo script di avvio automatico cosi' com'e'

## Configurazione database

Il backend usa Prisma con PostgreSQL. La stringa di connessione viene letta dalla variabile d'ambiente `DB_URL`.

Esempio:

```bash
DB_URL="postgresql://USER:PASSWORD@localhost:5432/priority_link"
```

Lo schema Prisma definisce:

- `User`: utente con nome, cognome, percorso di studio/lavoro e lista impegni;
- `Commitment`: impegno con nome, inizio, fine, ricorrenza opzionale, categoria e riferimento all'utente.

Applicare le migrazioni dal backend:

```bash
cd be-priority-link
npm install
npx prisma migrate dev
```

Nota: le custom actions Rasa creano impegni con `userId: 1`, quindi nel database deve esistere un utente con `id = 1`.

## Avvio manuale

Aprire terminali separati.

### 1. Rasa action server

```bash
cd be-priority-link/time-mate
rasa run actions
```

### 2. Rasa server

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

Il frontend/backend si aspettano Rasa su:

```text
http://localhost:5005/webhooks/rest/webhook/
```

### 3. Backend Express

```bash
cd be-priority-link
npm install
node index.js
```

Il backend parte su:

```text
http://localhost:3001
```

### 4. Frontend Vite

```bash
cd fe-priority-link
npm install
npm run dev
```

Il frontend Vite e' normalmente disponibile su:

```text
http://localhost:5173
```

## Avvio tramite script

Sono presenti script root per avviare i processi principali:

- `start-windows.bat`
- `start-linux.sh`
- `start-mac.sh`

Gli script avviano:

- Rasa action server;
- Rasa server con modello preaddestrato;
- backend Node;
- frontend Vite.

Nota: gli script usano `nodemon run` per il backend. Se `nodemon` non e' installato globalmente, usare `node index.js` oppure installare/configurare `nodemon`.

## API backend

Base URL:

```text
http://localhost:3001
```

### `GET /api/commitments`

Restituisce tutti gli impegni ordinati per `startDateTime` crescente.

### `POST /api/newcommitments`

Crea uno o piu' impegni. Il body atteso e' un array.

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

Aggiorna un impegno.

```json
{
  "updatedData": {
    "name": "Nuovo nome",
    "category": "Study"
  }
}
```

### `DELETE /api/deletecommitment/:id`

Elimina un impegno.

### `POST /api/sendMessage`

Inoltra il messaggio al webhook REST di Rasa.

```json
{
  "message": "Start conversation"
}
```

## Flusso chatbot

Il frontend invia inizialmente:

```text
Start habit setting
```

Rasa guida l'utente nella raccolta delle abitudini:

1. lavoro;
2. studio;
3. tempo libero;
4. pasti;
5. priorita'.

Quando Rasa risponde:

```text
I think we're done!
```

il frontend passa alla pagina calendario. Nella pagina calendario il bot viene avviato con:

```text
Start conversation
```

Quando una custom action crea un nuovo task e risponde:

```text
Task inserted!
```

il frontend ricarica gli impegni dal backend.

## Formato impegni nel frontend

Gli impegni ricevuti dal backend vengono convertiti in oggetti compatibili con DevExtreme Scheduler:

- `category` diventa `text`;
- `name` diventa `description`;
- `startDateTime` diventa `startDate`;
- `endDateTime` diventa `endDate`;
- `category` viene mappata a `type`:
  - `Work` -> `1`;
  - `Study` -> `2`;
  - `Free-time` -> `3`;
- `recurrency` viene mappata a una RRULE se vale `WEEKLY` o `MONTHLY`.

## Note operative

- Il CORS del backend consente richieste dal frontend su `http://localhost:5173`.
- Il backend ascolta su `3001`.
- Rasa ascolta su `5005`.
- L'action server Rasa ascolta su `5055`.
- Le custom actions usano date calcolate a partire dal giorno della settimana piu' vicino.
- Le categorie riconosciute dal frontend sono `Work`, `Study` e `Free-time`.
- Nel client frontend e' presente una funzione `createNewCommitment`, ma punta a `api/newcommitment}`; l'endpoint backend effettivo e' `api/newcommitments` e accetta un array.

## Test e file utili

- `be-priority-link/queries_api.http` contiene esempi di chiamate API.
- `be-priority-link/time-mate/tests/test_stories.yml` contiene test story Rasa di esempio.
- `be-priority-link/time-mate/test_answers.txt` contiene esempi di conversazione e chiamata al webhook REST.
