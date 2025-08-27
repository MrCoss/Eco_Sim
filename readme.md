# EcoSim: Forest Cover Type Prediction

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white) ![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## Demo Screenshot

![alt text](screencapture-localhost-3000-2025-08-27-23_29_46.png)

## About The Project

EcoSim is an intelligent web application that peers into the future of our forests. It leverages a sophisticated machine learning model to analyze geographic data and reveal the hidden patterns of the wild, predicting the dominant tree species for a given location based on cartographic variables.

This project showcases a full-stack implementation, featuring a dynamic React frontend that communicates with a Python/Flask backend serving the prediction model. It's designed to be a clean, professional, and comprehensive demonstration of data science and web development skills.

---

## Key Features

- **AI-Powered Predictions:** Utilizes a trained Random Forest Classifier to predict one of seven forest cover types with high accuracy.
- **Interactive Data Input:** A sleek, user-friendly form allows for the input of all required cartographic variables.
- **Prediction Confidence:** Displays a probability chart showing the model's confidence score for all potential cover types.
- **Data Visualization:** Features an interactive map to visualize sample forest cover data points from the dataset.
- **Persistent History:** Saves past predictions in local storage and displays them in a summary chart for trend analysis.
- **Detailed Species Information:** Shows detailed classification, a summary, and a relevant image for each predicted species.

---

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Python, Flask
- **Machine Learning:** Scikit-learn, Pandas
- **Deployment:** Vercel

---

## Project Structure

The project is organized into a monorepo structure with distinct frontend and backend directories, making it scalable and easy to manage.

```bash
/
├── app/
│   ├── frontend/       # React application source
│   └── backend/        # Flask API and model files
├── data/               # Raw and processed datasets
├── models/             # Trained machine learning models (.pkl)
├── notebooks/          # Jupyter notebooks for EDA and model training
├── reports/            # Project reports and analysis
└── vercel.json         # Vercel deployment configuration
```

---

## Local Setup & Installation

### Prerequisites

- Node.js v16+ and npm
- Python v3.9+ and pip

### Backend Setup

1. **Navigate to the backend directory:**

    ```bash
    cd app/backend
    ```

2. **Create and activate a virtual environment (Recommended):**

    ```bash
    # Create the environment
    python -m venv venv

    # Activate it (Windows)
    .\venv\Scripts\activate

    # Activate it (macOS/Linux)
    source venv/bin/activate
    ```

3. **Install the required Python packages:**

    ```bash
    pip install -r requirements.txt
    ```

4. **Run the Flask server:**

    ```bash
    python backend.py
    ```

    The backend API will now be running at `http://localhost:8000`.

### Frontend Setup

1. **Navigate to the frontend directory in a new terminal:**

    ```bash
    cd app/frontend
    ```

2. **Install the required npm packages:**

    ```bash
    npm install
    ```

3. **Start the React development server:**

    ```bash
    npm start
    ```

    The application will open at `http://localhost:3000`. The `proxy` in `package.json` will automatically forward API requests to the backend.

---

## Deployment

This project is configured for a seamless deployment experience on **Vercel**.

1. **Push your project** to a GitHub repository.
2. **Import the repository** into your Vercel account.
3. **Deploy.** The `vercel.json` file in the root directory automatically configures the build settings, environment variables, and routing for both the frontend and backend. Vercel will handle the rest.

---

## License

Distributed under the MIT License. See `LICENSE`.
