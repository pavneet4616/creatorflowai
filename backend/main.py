from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from core.database import engine, Base
from api import projects, pipelines, manifests

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS Middleware for Cloudflare Worker & Hostinger Frontend access
origins = [
    "https://lightgray-gnat-186819.hostingersite.com",
    "http://localhost:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request, call_next):
    print(f"[{request.method}] {request.url.path}")
    response = await call_next(request)
    print(f"-> Status {response.status_code}")
    return response

# Include Routers
app.include_router(projects.router, prefix=settings.API_V1_STR)
app.include_router(pipelines.router, prefix=settings.API_V1_STR)
app.include_router(manifests.router, prefix=settings.API_V1_STR)
app.include_router(assets.router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "Welcome to CreatorFlow AI Backend"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
