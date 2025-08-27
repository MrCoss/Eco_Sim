# backend.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import xgboost as xgb
import joblib
import pandas as pd
import numpy as np
from pathlib import Path
import json

# --- 1. SETUP ---
app = FastAPI(
    title="EcoSim Prediction API",
    description="An API to predict forest cover type using an XGBoost model.",
    version="1.0.0"
)

# Allow requests from your React frontend (CORS)
origins = [
    "http://localhost:3000", # Default React dev server
    "http://localhost:5173", # Default Vite dev server
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. LOAD MODEL ARTIFACTS ---
# This section is updated to match your new folder structure.
model = None
scaler = None
train_columns = None # To store the feature order

@app.on_event("startup")
def load_model_artifacts():
    """Load model, scaler, and artifacts at application startup for efficiency."""
    global model, scaler, train_columns
    try:
        # The script is in app/backend/, so the artifacts are in a relative path
        artifacts_path = Path(__file__).resolve().parent / "project_outputs" / "forest_cover"
        
        MODEL_PATH = artifacts_path / "models" / "model_xgb.joblib"
        SCALER_PATH = artifacts_path / "models" / "scaler.joblib"
        ARTIFACTS_JSON_PATH = artifacts_path / "models" / "artifacts.json"

        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        
        # Load the feature order from the artifacts.json file
        with open(ARTIFACTS_JSON_PATH, 'r') as f:
            artifacts = json.load(f)
            train_columns = artifacts['feature_order']

        print("INFO:     Model, scaler, and artifacts loaded successfully on startup.")
    except Exception as e:
        print(f"ERROR:    Failed to load model artifacts on startup. Please check paths. Details: {e}")


# --- 3. DEFINE DATA STRUCTURE ---
class ForestCoverFeatures(BaseModel):
    Elevation: int = Field(..., example=2596)
    Aspect: int = Field(..., example=51)
    Slope: int = Field(..., example=3)
    Horizontal_Distance_To_Hydrology: int = Field(..., example=258)
    Vertical_Distance_To_Hydrology: int = Field(..., example=0)
    Horizontal_Distance_To_Roadways: int = Field(..., example=510)
    Hillshade_9am: int = Field(..., example=221)
    Hillshade_Noon: int = Field(..., example=232)
    Hillshade_3pm: int = Field(..., example=148)
    Horizontal_Distance_To_Fire_Points: int = Field(..., example=6279)
    # In a full app, you'd add Wilderness_Area (4 features) and Soil_Type (40 features)

# --- 4. API ENDPOINT ---
@app.post("/predict")
async def predict(features: ForestCoverFeatures):
    if not model or not scaler or not train_columns:
        return {"error": "Model not loaded. Check backend server logs for details."}

    class_names = [
        "Spruce/Fir", "Lodgepole Pine", "Ponderosa Pine", "Cottonwood/Willow",
        "Aspen", "Douglas-fir", "Krummholz"
    ]

    try:
        # Create a DataFrame from the input features
        input_data = features.dict()
        df = pd.DataFrame([input_data])
        
        # Simulate the remaining 44 one-hot encoded features
        for i in range(1, 5):
            df[f'Wilderness_Area_{i}'] = 0
        for i in range(1, 41):
            df[f'Soil_Type_{i}'] = 0
        
        # Ensure the column order matches the training data exactly
        df = df.reindex(columns=train_columns, fill_value=0)

        # Preprocess the data using the saved scaler
        numerical_features = list(scaler.feature_names_in_)
        df[numerical_features] = scaler.transform(df[numerical_features])

        # Make a prediction
        prediction_index = int(model.predict(df)[0])
        predicted_class = class_names[prediction_index]

        return {"prediction": predicted_class}

    except Exception as e:
        return {"error": f"An error occurred during prediction: {e}"}

@app.get("/")
def read_root():
    return {"message": "EcoSim Prediction API is running."}
