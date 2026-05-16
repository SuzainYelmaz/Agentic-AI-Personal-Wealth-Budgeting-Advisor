"""LLM tool-calling utilities for structured agent outputs."""

from langchain_core.tools import tool
from app.services.openrouter import get_llm


@tool
def classify_spending(description: str, merchant: str, amount: float) -> dict:
    """Use LLM to classify a single transaction into category/subcategory."""
    prompt = (
        f"Classify this transaction:\n"
        f"Description: {description}\nMerchant: {merchant}\nAmount: ${amount:.2f}\n\n"
        f"Return JSON: {{category, subcategory, is_essential}}"
    )
    response = get_llm(temperature=0.1).invoke(prompt)
    return {"raw_classification": response.content}


@tool
def generate_savings_tip(category: str, overspend_pct: float) -> str:
    """Generate a personalized savings tip for an overspent category."""
    prompt = (
        f"Give one concise, actionable savings tip for someone "
        f"who overspent by {overspend_pct:.0f}% in '{category}'. "
        f"Max 2 sentences."
    )
    return get_llm(temperature=0.5).invoke(prompt).content
