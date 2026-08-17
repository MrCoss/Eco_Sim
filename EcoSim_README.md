# EcoSim

## AI Forest Cover Type Predictor

EcoSim is a full-stack machine-learning application for predicting dominant forest cover types from cartographic and environmental features.

The application combines an **XGBoost classification model** with a **FastAPI inference backend** and a **React + Tailwind CSS frontend**. It provides an interactive interface for testing forest-cover scenarios using geographical and environmental inputs.

The project demonstrates an end-to-end workflow covering machine-learning inference, API development, frontend engineering, model packaging, and cloud deployment.

https://github.com/user-attachments/assets/4cbe88d9-30ac-4055-9ffe-e6e4cd5f833d

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/5decae8d-3919-47cf-be7e-e739ed7e1139" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/4818a349-57e1-4a75-8f2d-e10136237199" />
---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Key Features](#key-features)
- [Supported Prediction Inputs](#supported-prediction-inputs)
- [System Architecture](#system-architecture)
- [How It Works](#how-it-works)
- [Dataset](#dataset)
- [Machine Learning Model](#machine-learning-model)
- [Model Performance](#model-performance)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Local Installation](#local-installation)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [Engineering Highlights](#engineering-highlights)
- [Interview Talking Points](#interview-talking-points)
- [Limitations](#limitations)
- [Future Enhancements](#future-enhancements)
- [Demo](#demo)
- [Security](#security)
- [Author](#author)
- [License](#license)

---

# Overview

EcoSim uses machine learning to predict forest cover types from geographical, environmental, and cartographic variables.

The application is designed around the UCI Forest Cover Type dataset and supports classification across **seven forest cover classes**.

The complete application combines:

```text
Environmental / Cartographic Features
                |
                v
          XGBoost Model
                |
                v
        FastAPI Inference API
                |
                v
        React Web Interface
                |
                v
       Interactive Prediction
```

---

# Problem Statement

Forest composition can vary significantly depending on geographical and environmental conditions.

Analyzing relationships between variables such as:

- Elevation
- Aspect
- Slope
- Hydrology distance
- Roadway distance
- Fire-point distance
- Wilderness region
- Soil type

can be difficult when working directly with structured datasets.

EcoSim provides a machine-learning interface that allows users to enter these variables and obtain a predicted forest cover type.

---

# Solution

EcoSim uses a trained **XGBoost classifier** to map cartographic and environmental inputs to one of seven forest cover classes.

The application separates the machine-learning inference layer from the frontend:

```text
                     User
                      |
                      v
              React Frontend
                      |
                      | HTTP Request
                      v
              FastAPI Backend
                      |
                      v
              Feature Preparation
                      |
                      v
                XGBoost Model
                      |
                      v
             Forest Cover Prediction
                      |
                      v
              API Response
                      |
                      v
              React Interface
```

This architecture provides a clean separation between:

- User interface
- API layer
- Machine-learning inference

---

# Key Features

## Real-Time AI Predictions

The application provides interactive forest cover predictions using the trained XGBoost classifier.

---

## Seven-Class Classification

The model predicts one of seven forest cover classes represented in the Forest Cover Type dataset.

---

## Cartographic Feature Input

Users can provide geographical and environmental variables through the frontend interface.

---

## Wilderness Area Selection

The application provides intuitive controls for selecting the wilderness area.

The source project describes four wilderness areas in the dataset.

---

## Soil Type Selection

The frontend provides soil-type selection controls based on the dataset's soil classes.

The source project describes 40 soil types.

---

## Responsive User Interface

The frontend is built using React and Tailwind CSS.

---

## Light and Dark Themes

The application supports adaptive light and dark themes.

---

## Species Insights

The interface includes an expandable species insights section containing:

- Species summary
- Reference image

---

## Cloud-Ready Architecture

The backend is designed as a FastAPI service and the model is packaged using Joblib for lightweight inference.

---

# Supported Prediction Inputs

The underlying dataset contains cartographic and environmental variables including:

| Feature Category | Examples |
|---|---|
| Terrain | Elevation, Aspect, Slope |
| Hydrology | Horizontal and vertical distances to hydrology |
| Infrastructure | Distance to roadways |
| Fire-related | Distance to fire points |
| Geography | Wilderness Area |
| Soil | Soil Type |

The project description identifies these variables as the primary inputs used for forest cover classification.

---

# System Architecture

```text
                         ECOSIM
                           |
            +--------------+--------------+
            |                             |
            v                             v
      React Frontend                 FastAPI Backend
      Tailwind CSS                        |
            |                             |
            | HTTP Request                |
            +------------->---------------+
                                          |
                                          v
                                Feature Processing
                                          |
                                          v
                                   Joblib Model
                                          |
                                          v
                                   XGBoost Model
                                          |
                                          v
                              Forest Cover Prediction
                                          |
                                          v
                                   JSON Response
                                          |
                                          v
                                  React Frontend
```

---

# How It Works

## 1. User Input

The user enters environmental and cartographic values through the React interface.

```text
Elevation
Aspect
Slope
Hydrology Distances
Roadway Distance
Fire Point Distance
Wilderness Area
Soil Type
```

---

## 2. API Request

The frontend sends the prediction inputs to the FastAPI backend.

```text
React UI
   |
   | HTTP Request
   v
FastAPI
```

---

## 3. Feature Preparation

The backend prepares the incoming values in the format expected by the trained model.

---

## 4. Model Inference

The trained XGBoost classifier performs the prediction.

The model artifact is packaged using Joblib for lightweight loading and inference.

```text
Input Features
      |
      v
Feature Preparation
      |
      v
XGBoost Classifier
      |
      v
Predicted Cover Type
```

---

## 5. API Response

The backend returns the prediction to the frontend.

```text
XGBoost
   |
   v
Prediction
   |
   v
FastAPI Response
   |
   v
React UI
```

---

## 6. Result Presentation

The frontend displays the predicted forest cover type together with the available species information.

---

# Dataset

EcoSim is based on the **UCI Forest Cover Type dataset**.

The dataset contains cartographic variables describing forested regions in the United States.

The project uses:

- Elevation
- Aspect
- Slope
- Horizontal distance to hydrology
- Vertical distance to hydrology
- Horizontal distance to fire points
- Horizontal distance to roadways
- Wilderness area
- Soil type
- Seven forest cover classes

The dataset contains:

```text
4 Wilderness Areas
40 Soil Types
7 Cover Type Classes
```

---

# Machine Learning Model

## XGBoost

EcoSim uses **XGBoost** as its primary classification model.

XGBoost is a gradient-boosting framework suitable for structured and tabular datasets.

For EcoSim, the model maps cartographic and environmental features to one of the seven forest cover classes.

---

## Model Workflow

```text
Forest Cover Type Dataset
            |
            v
       Data Preparation
            |
            v
       Feature Selection
            |
            v
       Model Training
            |
            v
         XGBoost
            |
            v
       Model Evaluation
            |
            v
       Model Packaging
          Joblib
            |
            v
       FastAPI Inference
```

---

# Model Performance

The source project describes the model as providing high-performance classification and reports average inference latency below 100 ms.

| Metric | Reported Result |
|---|---|
| Model | XGBoost |
| Classification | Seven forest cover classes |
| Inference Speed | `<100 ms` average |
| Model Packaging | Joblib |

> The source README does not provide a numeric test-set accuracy, precision, recall, or F1-score. Therefore, this README does not invent additional evaluation values.

---

# Technology Stack

| Technology | Purpose |
|---|---|
| **Python** | Backend and machine-learning development |
| **FastAPI** | REST API and model inference |
| **XGBoost** | Forest cover classification |
| **Scikit-learn** | Machine-learning utilities |
| **Joblib** | Model serialization and loading |
| **React** | Frontend application |
| **Tailwind CSS** | Frontend styling |
| **Vite / React Tooling** | Frontend development and build workflow |
| **Render** | Cloud deployment |

---

# Project Structure

```text
EcoSim/
│
├── backend/
│   ├── project_outputs/
│   │   └── Trained models and artifacts
│   │
│   ├── backend.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# Local Installation

## Prerequisites

Install:

- Python 3.9+
- Node.js 16+
- npm
- Git

---

# Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### macOS / Linux

```bash
source venv/bin/activate
```

Install the Python dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn backend:app --reload
```

The backend should be available at:

```text
http://localhost:8000
```

---

# Frontend Setup

Open a second terminal.

Navigate to the frontend:

```bash
cd frontend
```

Install the required npm packages:

```bash
npm install
```

Start the React development server:

```bash
npm start
```

The frontend should be available at:

```text
http://localhost:3000
```

---

# Running the Application

Both services should be running simultaneously.

### Terminal 1 — Backend

```bash
cd backend
uvicorn backend:app --reload
```

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm start
```

Then open:

```text
http://localhost:3000
```

The complete local workflow is:

```text
Browser
   |
   v
React Frontend
   |
   | HTTP
   v
FastAPI Backend
   |
   v
XGBoost Model
   |
   v
Forest Cover Prediction
   |
   v
React Result Interface
```

---

# Deployment

The source project describes a cloud deployment architecture using **Render**.

## Backend

The FastAPI service is deployed as a cloud API.

```text
FastAPI
   |
   v
Render
```

## Model

The trained model is packaged using Joblib to support lightweight loading during inference.

## Frontend

The React frontend is deployed as a web application and communicates with the backend API.

> Exact production URLs and environment-variable configuration should be taken from the current repository deployment settings.

---

# Engineering Highlights

## End-to-End ML Application

EcoSim goes beyond a standalone machine-learning notebook.

It combines:

```text
Machine Learning
      +
API Development
      +
Frontend Development
      +
Cloud Deployment
```

---

## Model Serving

The trained XGBoost model is exposed through FastAPI, creating a clear boundary between the machine-learning layer and the frontend.

---

## Lightweight Model Packaging

Joblib is used for model serialization, allowing the trained model to be loaded by the backend during inference.

---

## Interactive Scenario Testing

The frontend allows users to modify environmental and cartographic variables and test different prediction scenarios.

---

## Responsive User Experience

The React interface includes:

- Responsive form controls
- Dropdown-based selections
- Theme support
- Species insights
- Prediction results

---

# Interview Talking Points

EcoSim demonstrates practical experience with:

- Machine learning
- XGBoost
- Tabular classification
- Scikit-learn
- Joblib
- FastAPI
- REST APIs
- React
- Tailwind CSS
- Feature-based prediction systems
- Model serving
- Cloud deployment
- Full-stack AI engineering
- Environmental data analysis

---

## 60-Second Interview Explanation

> EcoSim is a full-stack machine-learning application that predicts forest cover types using cartographic and environmental features from the UCI Forest Cover Type dataset. I trained an XGBoost classifier to perform seven-class classification and packaged the trained model using Joblib for inference. I then exposed the model through a FastAPI backend and built a React and Tailwind CSS frontend where users can enter environmental variables such as elevation, slope, wilderness area, and soil type. The frontend sends the inputs to the API, the backend performs model inference, and the prediction is returned to the interface with supporting species information. The project demonstrates the complete workflow from structured environmental data and model development to API-based inference and cloud deployment.

---

# Technical Design Considerations

## Why XGBoost?

XGBoost is well suited to structured/tabular data and can model nonlinear relationships between environmental variables and target classes.

## Why FastAPI?

FastAPI provides a lightweight interface for exposing model inference through HTTP APIs.

## Why Joblib?

Joblib provides a practical way to serialize and reload trained Python machine-learning models for inference.

## Why React?

React provides a component-based approach for building an interactive prediction interface.

## Why Separate Frontend and Backend?

Separating the frontend and inference service allows each layer to be developed and deployed independently.

```text
React
  |
  | HTTP
  v
FastAPI
  |
  v
XGBoost
```

---

# Limitations

The current project has several limitations:

- The model is limited to the seven cover classes represented by the dataset.
- Predictions are dependent on the quality and distribution of the training data.
- The system is based on historical structured data rather than continuously updated environmental measurements.
- The reported README does not provide a complete numeric model evaluation table.
- The system does not replace professional forestry or ecological analysis.
- Production-scale deployment would require additional monitoring, validation, and security controls.

---

# Future Enhancements

Potential improvements include:

- [ ] Add SHAP-based model explainability
- [ ] Add feature-importance visualization
- [ ] Add multi-feature sensitivity analysis
- [ ] Add geospatial prediction maps
- [ ] Add interactive heat maps
- [ ] Add additional environmental datasets
- [ ] Add continuous model retraining
- [ ] Add model versioning
- [ ] Add automated model evaluation
- [ ] Add prediction history
- [ ] Add API authentication
- [ ] Add automated testing
- [ ] Add CI/CD
- [ ] Improve deployment monitoring

---

# Demo

The original project includes a demo video:

```text
Untitled.video.-.Made.with.Clipchamp.1.1.mp4
```

Recommended repository structure:

```text
docs/
└── demo/
    └── ecosim-demo.mp4
```

---

# Screenshots

Recommended screenshot structure:

```text
docs/
└── screenshots/
    ├── home.png
    ├── prediction-form.png
    ├── prediction-result.png
    └── species-insights.png
```

Example:

```markdown
![EcoSim Prediction Interface](docs/screenshots/home.png)
```

---

# Security

Do not commit sensitive credentials or private deployment configuration to the repository.

If environment-specific configuration is required, use environment variables.

For production deployments, consider:

- API authentication
- HTTPS
- Input validation
- Rate limiting
- Error handling
- Logging
- Monitoring

The model and API should also be protected from untrusted or malformed input.

---

# Reproducibility

To reproduce the application locally:

```bash
git clone https://github.com/costaspinto/Eco_Sim.git
cd Eco_Sim
```

Start the backend:

```bash
cd backend

python -m venv venv
```

Activate the virtual environment.

### Windows

```bash
venv\Scripts\activate
```

### macOS / Linux

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn backend:app --reload
```

In another terminal:

```bash
cd frontend
npm install
npm start
```

Then open:

```text
http://localhost:3000
```

---

# Skills Demonstrated

```text
Python
Machine Learning
XGBoost
Scikit-learn
Joblib
FastAPI
REST APIs
React
Tailwind CSS
Feature Engineering
Tabular Classification
Model Serving
Environmental Data
Full-Stack AI Development
Cloud Deployment
```

---

# Project Summary

EcoSim demonstrates how a machine-learning model can be transformed into an interactive full-stack application.

The end-to-end architecture is:

```text
Forest Cover Type Dataset
          |
          v
    Data Preparation
          |
          v
     XGBoost Model
          |
          v
     Joblib Artifact
          |
          v
    FastAPI Backend
          |
          v
    React Frontend
          |
          v
 Interactive Prediction
          |
          v
 Forest Cover Result
```

The project combines **environmental machine learning, model serving, API development, frontend engineering, and cloud deployment** into a practical AI application.

---

# Author

**Costas Pinto**

AI Engineer & Full-Stack Developer

- GitHub: [Costas Pinto](https://github.com/costaspinto)

---

# License

This project is licensed under the **MIT License**.

See the repository's `LICENSE` file for the complete license terms.
