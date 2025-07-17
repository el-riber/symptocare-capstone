from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import summarize

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(summarize.router)
