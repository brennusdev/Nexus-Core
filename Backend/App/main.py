from fastapi import FastAPI

app = FastAPI(
    title="Nexus Core API",
    description="Backend oficial do Nexus Core",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "project": "Nexus Core",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }