# --- 1. SETUP ---
app = FastAPI(
    title="EcoSim Prediction API",
    description="An API to predict forest cover type using an XGBoost model.",
    version="1.0.0"
)

# Allow requests from specific frontends (CORS)
origins = [
    "http://localhost:3000",       # Local React dev server
    "http://localhost:5173",       # Local Vite dev server
    "https://ecosim.onrender.com", # Deployed frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,    # or use ["*"] to allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
