'use strict';

const dao = require('./dao');
const axios = require('axios');

const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());

const port = 3001;

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

app.get('/api/commitments', async (req, res) => {
  try {
    const result = await dao.getCommitments();
    if (result.error)
      res.status(404).json(result);
    else
      res.json(result);
  } catch (err) {
    res.status(500).end();
  }
});

app.post('/api/newcommitments', async (req, res) => {
  try {
    const newCommitments = req.body;
    const createdCommitments = await dao.createNewCommitments(newCommitments);
    
    res.status(201).json(createdCommitments);
  } catch (err) {
    console.error("An error occurred while adding the new commitment", err);
    res.status(500).end();
  }
}); 

app.post("/api/updatecommitment/:id", async (req, res) => {
  try {
    const commitmentId = req.params.id;
    const { updatedData } = req.body;
    const result = await dao.updateCommitment(commitmentId, updatedData);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete('/api/deletecommitment/:id', async (req, res) => {
  try {
    const commitmentId = req.params.id;
    const result = await dao.deleteCommitment(commitmentId);
    res.status(204).json(result); 
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/sendMessage", async (req, res) => {
  try {

  axios.post('http://localhost:5005/webhooks/rest/webhook/', req.body )
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(error => {
      console.error(`Error: ${error.message}`);
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
