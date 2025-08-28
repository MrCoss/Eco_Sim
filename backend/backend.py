# backend.py

import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List

# --- 1. SETUP ---
app = FastAPI(
    title="EcoSim Prediction API",
    description="An API to predict forest cover type using an XGBoost model.",
    version="1.0.0"
)

# Allow requests from specific frontends (CORS)
origins = [
    "http://localhost:3000",      # Local React dev server
    "http://localhost:5173",      # Local Vite dev server
    "https://ecosim.onrender.com", # Deployed frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,    # or use ["*"] to allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Model and Scaler Loading ---
# Load the pre-trained machine learning model and scaler at startup.
# This is more efficient than loading them for every request.
try:
    model = joblib.load('project_outputs/forest_cover/models/model_xgb.joblib')
    scaler = joblib.load('project_outputs/forest_cover/models/scaler.joblib')
    print("✅ Model and scaler loaded successfully.")
except FileNotFoundError:
    print("🔴 Error: Model or scaler file not found. Make sure the paths are correct.")
    model = None
    scaler = None

# --- Data Validation Model (Pydantic) ---
# This defines the exact structure and data types for the incoming request body.
# It automatically validates the data and generates documentation.
class ForestData(BaseModel):
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
    # One-hot encoded soil types
    Soil_Type1: int = Field(0, example=0)
    Soil_Type2: int = Field(0, example=0)
    Soil_Type10: int = Field(0, example=1)
    Soil_Type22: int = Field(0, example=0)
    Soil_Type23: int = Field(0, example=0)
    Soil_Type29: int = Field(0, example=0)
    Soil_Type32: int = Field(0, example=0)
    Soil_Type38: int = Field(0, example=0)
    # Add all other soil types your model was trained on, defaulting to 0

# --- Prediction Response Model ---
class PredictionResponse(BaseModel):
    prediction: str
    probabilities: List[dict]

# --- API Endpoints ---
@app.get("/", tags=["Root"])
def read_root():
    """A simple endpoint to check if the API is running."""
    return {"message": "Welcome to the EcoSim Prediction API!"}

@app.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict_forest_cover(data: ForestData):
    """
    Predicts the forest cover type based on input cartographic variables.
    """
    if not model or not scaler:
        raise HTTPException(status_code=500, detail="Model or scaler not loaded.")

    try:
        # Convert the input data into a numpy array in the correct order for the model.
        # This order MUST match the order of features the model was trained on.
        features = np.array([
            data.Elevation, data.Aspect, data.Slope,
            data.Horizontal_Distance_To_Hydrology, data.Vertical_Distance_To_Hydrology,
            data.Horizontal_Distance_To_Roadways, data.Hillshade_9am,
            data.Hillshade_Noon, data.Hillshade_3pm,
            data.Horizontal_Distance_To_Fire_Points,
            # Ensure all soil types are included in the correct order
            data.Soil_Type1, data.Soil_Type2, data.Soil_Type10, data.Soil_Type22,
            data.Soil_Type23, data.Soil_Type29, data.Soil_Type32, data.Soil_Type38
        ]).reshape(1, -1)

        # Apply the same scaling that was used during training
        scaled_features = scaler.transform(features)

        # Make the prediction and get probabilities
        prediction_index = model.predict(scaled_features)[0]
        prediction_probabilities = model.predict_proba(scaled_features)[0]

        # Map the prediction index to the cover type name
        cover_type_mapping = {
            1: 'Spruce/Fir',
            2: 'Lodgepole Pine',
            3: 'Ponderosa Pine',
            4: 'Cottonwood/Willow',
            5: 'Aspen',
            6: 'Douglas-fir',
            7: 'Krummholz'
        }
        prediction_name = cover_type_mapping.get(prediction_index, "Unknown")

        # Format probabilities for the response
        probabilities_list = [
            {"type": cover_type_mapping[i+1], "probability": float(prob)}
            for i, prob in enumerate(prediction_probabilities)
        ]

        return {
            "prediction": prediction_name,
            "probabilities": probabilities_list
        }

    except Exception as e:
        # Catch any errors during the prediction process
        raise HTTPException(status_code=500, detail=f"An error occurred during prediction: {str(e)}")

# --- To run this application ---
# In your terminal, navigate to the 'backend' directory and run:
# uvicorn backend:app --reload
