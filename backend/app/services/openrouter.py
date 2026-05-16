"""OpenRouter LLM client using LangChain's ChatOpenAI interface."""

from langchain_openai import ChatOpenAI
from app.config import settings


def get_llm(temperature: float = 0.3, max_tokens: int = 500) -> ChatOpenAI:
    """Create an OpenRouter-backed LLM instance with configurable token limit."""
    return ChatOpenAI(
        model=settings.OPENROUTER_MODEL,
        openai_api_key=settings.OPENROUTER_API_KEY,
        openai_api_base="https://openrouter.ai/api/v1",
        temperature=temperature,
        max_completion_tokens=max_tokens
    )


def get_structured_llm(schema, temperature: float = 0.1):
    """Create an LLM bound to a structured output schema."""
    return get_llm(temperature, max_tokens=2000).with_structured_output(schema)
