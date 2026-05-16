"""Node B — CategorizerAgent: Categorizes spending via structured LLM tool-calling."""

import json
from app.agents.state import WealthAdvisorState
from app.services.openrouter import get_llm
from app.tools.supabase_tools import update_transaction_category

CATEGORIZE_PROMPT = """You are a financial transaction categorizer. Categorize each transaction.

Transactions:
{transactions}

Return a JSON array where each item has:
- transaction_id: string
- category: string (Housing, Food, Transport, Entertainment, Health, Shopping, Utilities, Income, Other)
- subcategory: string (more specific label)
- is_essential: boolean

Return ONLY the JSON array, no other text."""


def _build_transaction_text(transactions: list[dict]) -> str:
    """Format transactions into a readable string for the LLM."""
    lines = [f"ID:{t['id']} | ${t['amount']} | {t['merchant']} | {t['description']}"
             for t in transactions]
    return "\n".join(lines)


def _parse_categories(response_text: str) -> list[dict]:
    """Parse LLM response into structured category list."""
    text = response_text.strip().strip("```json").strip("```").strip()
    return json.loads(text)


def _persist_categories(categories: list[dict]) -> int:
    """Write categories back to Supabase and return count."""
    for cat in categories:
        update_transaction_category.invoke(cat)
    return len(categories)


def categorizer_node(state: WealthAdvisorState) -> dict:
    """Categorize all transactions using structured LLM output."""
    if not state.get("transactions"):
        return {"categorized_transactions": [], "messages": ["CategorizerAgent: No transactions"]}
    try:
        prompt = CATEGORIZE_PROMPT.format(transactions=_build_transaction_text(state["transactions"]))
        response = get_llm(temperature=0.1, max_tokens=1500).invoke(prompt)
        categories = _parse_categories(response.content)
        count = _persist_categories(categories)
        return {
            "categorized_transactions": categories,
            "messages": [f"CategorizerAgent: Categorized {count} transactions"],
        }
    except Exception as e:
        return {"categorized_transactions": [], "errors": [f"Categorizer error: {e}"]}
