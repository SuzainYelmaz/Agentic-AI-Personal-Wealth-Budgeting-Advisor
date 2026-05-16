"""OpenRouter LLM client using LangChain's ChatOpenAI interface."""

from langchain_openai import ChatOpenAI
from app.config import settings


def get_llm(temperature: float = 0.3) -> ChatOpenAI:
    """Create an OpenRouter-backed LLM instance."""
    return ChatOpenAI(
        model=settings.OPENROUTER_MODEL,
        openai_api_key=settings.OPENROUTER_API_KEY,
        openai_api_base="https://openrouter.ai/api/v1",
        temperature=temperature,
    )


def get_structured_llm(schema, temperature: float = 0.1):
    """Create an LLM bound to a structured output schema."""
    return get_llm(temperature).with_structured_output(schema)
