# backend.py

import joblib
import numpy as np
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional

# --- 1. SETUP ---
app = FastAPI(
    title="EcoSim Prediction API",
    description="An API to predict forest cover type using an XGBoost model.",
    version="1.0.0"
)

# --- CORS Configuration ---
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Build absolute paths to model files ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'project_outputs', 'forest_cover', 'models', 'model_xgb.joblib')
SCALER_PATH = os.path.join(BASE_DIR, 'project_outputs', 'forest_cover', 'models', 'scaler.joblib')

# --- Model and Scaler Loading ---
try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    print("✅ Model and scaler loaded successfully.")
except FileNotFoundError:
    print(f"🔴 Error: Model or scaler not found. Looked in {MODEL_PATH} and {SCALER_PATH}")
    model = None
    scaler = None

# --- Data Validation Model (Pydantic) ---
class ForestData(BaseModel):
    # This class now includes ALL 54 features the model expects.
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
    
    # FIX: Added the four missing Wilderness_Area features
    Wilderness_Area_1: Optional[int] = 0
    Wilderness_Area_2: Optional[int] = 0
    Wilderness_Area_3: Optional[int] = 0
    Wilderness_Area_4: Optional[int] = 0
    
    # All 40 soil types
    Soil_Type1: Optional[int] = 0
    Soil_Type2: Optional[int] = 0
    Soil_Type3: Optional[int] = 0
    Soil_Type4: Optional[int] = 0
    Soil_Type5: Optional[int] = 0
    Soil_Type6: Optional[int] = 0
    Soil_Type7: Optional[int] = 0
    Soil_Type8: Optional[int] = 0
    Soil_Type9: Optional[int] = 0
    Soil_Type10: Optional[int] = 0
    Soil_Type11: Optional[int] = 0
    Soil_Type12: Optional[int] = 0
    Soil_Type13: Optional[int] = 0
    Soil_Type14: Optional[int] = 0
    Soil_Type15: Optional[int] = 0
    Soil_Type16: Optional[int] = 0
    Soil_Type17: Optional[int] = 0
    Soil_Type18: Optional[int] = 0
    Soil_Type19: Optional[int] = 0
    Soil_Type20: Optional[int] = 0
    Soil_Type21: Optional[int] = 0
    Soil_Type22: Optional[int] = 0
    Soil_Type23: Optional[int] = 0
    Soil_Type24: Optional[int] = 0
    Soil_Type25: Optional[int] = 0
    Soil_Type26: Optional[int] = 0
    Soil_Type27: Optional[int] = 0
    Soil_Type28: Optional[int] = 0
    Soil_Type29: Optional[int] = 0
    Soil_Type30: Optional[int] = 0
    Soil_Type31: Optional[int] = 0
    Soil_Type32: Optional[int] = 0
    Soil_Type33: Optional[int] = 0
    Soil_Type34: Optional[int] = 0
    Soil_Type35: Optional[int] = 0
    Soil_Type36: Optional[int] = 0
    Soil_Type37: Optional[int] = 0
    Soil_Type38: Optional[int] = 0
    Soil_Type39: Optional[int] = 0
    Soil_Type40: Optional[int] = 0

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
        data_dict = data.dict()
        
        # FIX: Create the feature list in the EXACT order the model was trained on.
        feature_list = [
            data_dict.get('Elevation'), data_dict.get('Aspect'), data_dict.get('Slope'),
            data_dict.get('Horizontal_Distance_To_Hydrology'), data_dict.get('Vertical_Distance_To_Hydrology'),
            data_dict.get('Horizontal_Distance_To_Roadways'), data_dict.get('Hillshade_9am'),
            data_dict.get('Hillshade_Noon'), data_dict.get('Hillshade_3pm'),
            data_dict.get('Horizontal_Distance_To_Fire_Points'),
            data_dict.get('Wilderness_Area_1', 0), data_dict.get('Wilderness_Area_2', 0),
            data_dict.get('Wilderness_Area_3', 0), data_dict.get('Wilderness_Area_4', 0)
        ]
        
        for i in range(1, 41):
            feature_list.append(data_dict.get(f'Soil_Type{i}', 0))

        features = np.array(feature_list).reshape(1, -1)
        
        print(f"Shape of features array for prediction: {features.shape}")

        scaled_features = scaler.transform(features)
        prediction_index = model.predict(scaled_features)[0]
        prediction_probabilities = model.predict_proba(scaled_features)[0]

        cover_type_mapping = {
            1: 'Spruce/Fir', 2: 'Lodgepole Pine', 3: 'Ponderosa Pine',
            4: 'Cottonwood/Willow', 5: 'Aspen', 6: 'Douglas-fir', 7: 'Krummholz'
        }
        prediction_name = cover_type_mapping.get(int(prediction_index), "Unknown")

        probabilities_list = [
            {"type": cover_type_mapping.get(i + 1, "Unknown"), "probability": float(prob)}
            for i, prob in enumerate(prediction_probabilities)
        ]

        return {"prediction": prediction_name, "probabilities": probabilities_list}

    except Exception as e:
        print(f"🔴 PREDICTION ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred during prediction: {str(e)}")
