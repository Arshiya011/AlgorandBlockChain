from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.upload import router as upload_router
from app.routes.analyze import router as analyze_router


app = FastAPI(
    title="Contract Risk Tagger API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(analyze_router)


@app.get("/")
def home():
    return {
        "message": "Contract Risk Tagger API is running!"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }