# Electronix AI - Sentiment Analysis Microservice

## Overview

This project is an end-to-end microservice for binary sentiment analysis, featuring:

- A Python FastAPI backend using a Hugging Face Transformer for sentiment inference
- A React frontend for user interaction
- A fine-tuning script for updating model weights
- Full containerization with Docker Compose

## Objective

Build and deliver a microservice and minimal web client for binary sentiment analysis, as per assignment requirements.

## Features

- **Model loading & inference:** Loads a text-classification model from Hugging Face. Exposes a `/predict` endpoint for sentiment analysis.
- **Fine-tuning:** Standalone CLI script to fine-tune the model on custom data and save updated weights.
- **Frontend:** Simple React UI to input text and display predictions.
- **Containerization:** All components run locally via Docker Compose.

## Setup & Run Instructions

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Running the App

1. Clone this repository and navigate to the project root.
2. Build and start all services:
   ```
   docker-compose up --build
   ```
3. Access the services:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

> **Note:** The first build may take 10–20 minutes due to large dependencies (e.g., torch). Subsequent runs are much faster.

### Stopping the App

- Press `Ctrl+C` in the terminal running Docker Compose.

## API Documentation

### POST `/predict`

- **Request:**
  ```json
  { "text": "Your text here" }
  ```
- **Response:**
  ```json
  { "label": "positive" | "negative", "score": float }
  ```
- **Example:**
  ```json
  { "label": "positive", "score": 0.987 }
  ```

## Fine-tuning the Model

1. Prepare your dataset as a JSONL file (one entry per line):
   ```json
   { "text": "Great product!", "label": "positive" }
   { "text": "Not good.", "label": "negative" }
   ```
2. Run the fine-tuning script:
   ```
   python finetune.py -data data.jsonl -epochs 3 -lr 3e-5
   ```
3. The updated model weights will be saved to `./model/` and loaded by the backend on next restart.

## Design Decisions

- **FastAPI** for high-performance, easy-to-use REST API
- **Hugging Face Transformers** for state-of-the-art NLP
- **React** for a modern, responsive frontend
- **Docker Compose** for reproducible, multi-service local development
- **Model weights** are shared via a volume for seamless updates

## Troubleshooting

- **Slow build:** The first Docker build downloads large dependencies. Please be patient.
- **Docker not running:** Ensure Docker Desktop is started before running any commands.
- **Port conflicts:** Make sure ports 3000 (frontend) and 8000 (backend) are free.

## Deliverables

- [x] Python backend (FastAPI) with `/predict` endpoint
- [x] React frontend
- [x] Fine-tuning script
- [x] Dockerfiles and docker-compose.yml
- [x] This README.md
- [ ] Screen recording (see below)
- [ ] (Optional) Deployed version or Docker Hub image

**Thank you for reviewing this project!**
