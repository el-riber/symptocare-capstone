import os
from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage

def get_ai_response(prompt: str) -> str:
    llm = ChatOpenAI(openai_api_key=os.getenv("OPENAI_API_KEY"))
    response = llm([HumanMessage(content=prompt)])
    return response.content
