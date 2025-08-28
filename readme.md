# EcoSim: AI Forest Cover Type Predictor

**Live Demo:** [**https://ecosim-frontend.onrender.com**](https://ecosim-frontend.onrender.com)

## About The Project

EcoSim is an intelligent web application that peers into the future of our forests. It leverages a sophisticated XGBoost model to analyze geographic data and reveal the hidden patterns of the wild, predicting the dominant tree species for a given location based on cartographic variables.

This project showcases a full-stack implementation, featuring a dynamic React frontend that communicates with a high-performance Python/FastAPI backend. It's designed to be a clean, professional, and comprehensive demonstration of data science and modern web development skills.

## Key Features

* **Real-time AI Predictions:** Utilizes a trained XGBoost Classifier to predict one of seven forest cover types with high accuracy.
* **Interactive & Responsive UI:** A sleek, user-friendly form allows for the input of all required cartographic variables on any device.
* **Dynamic Theming:** Features a light/dark mode toggle for user preference.
* **Detailed Species Information:** Shows detailed classification, a summary, and a relevant image for each predicted species.
* **Quick Selection:** Dropdown menus for Wilderness Area and Soil Type allow for rapid scenario testing.
* **Expandable "About" Section:** A clean, collapsible section provides context about the project and the dataset used.

## Tech Stack

* **Frontend:** React, Tailwind CSS
* **Backend:** Python, FastAPI
* **Machine Learning:** Scikit-learn, XGBoost, Joblib
* **Deployment:** Render

## Project Structure

The project is organized into a monorepo structure with distinct frontend and backend directories, making it scalable and easy to manage.

 ```
├── backend/          # FastAPI API, ML model, and dependencies
│   ├── project_outputs/
│   ├── backend.py
│   └── requirements.txt
├── frontend/         # React application source
│   ├── public/
│   ├── src/
│   └── package.json
├── .gitignore
└── readme.md
 ```

## Local Setup & Installation

### Prerequisites

* Node.js v16+ and npm
* Python v3.9+ and pip

### Backend Setup

1.  **Navigate to the backend directory:**
    ```
    cd backend
    ```
2.  **Create and activate a virtual environment (Recommended):**
    ```
    # Create the environment
    python -m venv venv

    # Activate it (Windows)
    .\venv\Scripts\activate

    # Activate it (macOS/Linux)
    source venv/bin/activate
    ```
3.  **Install the required Python packages:**
    ```
    pip install -r requirements.txt
    ```
4.  **Run the FastAPI server:**
    ```
    uvicorn backend:app --reload
    ```
    The backend API will now be running at `http://localhost:8000`.

### Frontend Setup

1.  **Navigate to the frontend directory in a new terminal:**
    ```
    cd frontend
    ```
2.  **Install the required npm packages:**
    ```
    npm install
    ```
3.  **Start the React development server:**
    ```
    npm start
    ```
    The application will open at `http://localhost:3000`.

### Run Both Servers Concurrently

From th
