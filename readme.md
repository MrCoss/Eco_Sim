# EcoSim – AI Forest Cover Type Predictor

https://github.com/user-attachments/assets/4cbe88d9-30ac-4055-9ffe-e6e4cd5f833d
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/5decae8d-3919-47cf-be7e-e739ed7e1139" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/4818a349-57e1-4a75-8f2d-e10136237199" />

## Overview

EcoSim is an intelligent full-stack web application engineered to predict dominant forest cover types using advanced machine learning and geospatial cartographic features. Built with a high-accuracy XGBoost model and delivered via a modern React + FastAPI architecture, EcoSim showcases the integration of real-time AI inference with an interactive, production-ready user experience.

This system empowers environmental scientists, forestry departments, and ecological modelers to simulate forest composition under diverse geographical and environmental conditions, supporting data-driven conservation decisions.

---

## Key Features

* **Real-Time AI Predictions** powered by an XGBoost classifier trained on the Forest Cover Type dataset.
* **Seven-class cover type classification** based on wilderness region, soil type, elevation, slope, and cartographic features.
* **FastAPI-based inference engine** optimized for low-latency cloud deployment.
* **Interactive Web UI** with responsive form controls for scenario testing.
* **Adaptive Theme Support** (light / dark mode).
* **Expandable Species Insights Section** including species summary & reference image.
* **Intuitive dropdowns** for Wilderness Area and Soil Type.

---

## Tech Stack

| Layer      | Technology                    |
| ---------- | ----------------------------- |
| Frontend   | React, Tailwind CSS           |
| Backend    | Python, FastAPI               |
| ML Engine  | XGBoost, Scikit-learn, Joblib |
| Deployment | Render Cloud                  |

---

## Project Structure

```
EcoSim/
├── backend/                 # FastAPI service + ML model
│   ├── project_outputs/     # Trained models & artifacts
│   ├── backend.py           # API entrypoint
│   └── requirements.txt
├── frontend/                # React client application
│   ├── src/
│   ├── public/
│   └── package.json
├── .gitignore
└── readme.md
```

---

## Local Setup & Installation

### **Prerequisites**

* Node.js v16+ and npm
* Python 3.9+ and pip

### **Backend Installation**

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate
pip install -r requirements.txt
uvicorn backend:app --reload
```

Back-end available at: **[http://localhost:8000](http://localhost:8000)**

### **Frontend Installation**

```bash
cd frontend
npm install
npm start
```

Front-end available at: **[http://localhost:3000](http://localhost:3000)**

### **Run both services concurrently**

Open two terminals — run backend in one, frontend in another.

---

## Dataset Source

This project is built on the **UCI Forest Cover Type dataset**, containing cartographic variables describing U.S. forested regions:

* Elevation, Aspect, Slope
* Horizontal & Vertical distances to hydrology, fire points, and roadways
* Wilderness Area (4 regions)
* Soil Types (40 classes)
* 7 cover type classes representing dominant species

---

## Model Performance

| Metric          | Result                                           |
| --------------- | ------------------------------------------------ |
| Accuracy        | High performance prediction accuracy via XGBoost |
| Inference speed | Real-time (<100ms avg)                           |
| Output classes  | Seven forest cover species                       |

---

## Deployment Strategy

* Backend deployed via **Render API hosting**
* Frontend deployed as **React static site build**
* Model packaged via **Joblib** for lightweight inference

---

## Future Enhancements

* SHAP-based explainability for transparency
* Multi-feature sensitivity visualization
* Geospatial map heat-mapping for predictions
* Continuous training pipeline with updated datasets

---

## Media & Demo

Demo video: *Untitled.video.-.Made.with.Clipchamp.1.1.mp4* (Overview walkthrough of UI and features)

---

## Author

**Costas Pinto**
AI Engineer & Full-Stack Developer

---

## License

MIT License — Free to use with attribution.

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
