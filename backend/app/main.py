from fastapi import FastAPI

app = FastAPI(
    title="Contract Risk Tagger API",
    version="1.0.0"
)

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