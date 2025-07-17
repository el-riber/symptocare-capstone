from fastapi import APIRouter, Request
from pydantic import BaseModel
from app.services.chat_assistant import get_ai_response

router = APIRouter()

class ChatRequest(BaseModel):
    question: str

@router.post("/chat")
async def chat_endpoint(payload: ChatRequest):
    reply = get_ai_response(payload.question)
    return {"reply": reply}
