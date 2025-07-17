from fastapi import APIRouter
from app.utils.supabase_client import supabase
from app.services.summarizer import generate_mood_summary

router = APIRouter()

@router.get("/summarize/{user_id}")
def summarize(user_id: str):
    result = supabase \
        .table("mood_entries") \
        .select("mood, reflection, created_at") \
        .eq("user_id", user_id) \
        .order("created_at", desc=False) \
        .limit(7) \
        .execute()

    entries = result.data
    if not entries:
        return {"summary": "No mood entries found."}

    summary = generate_mood_summary(entries)
    return {"summary": summary}
