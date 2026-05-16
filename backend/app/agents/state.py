"""LangGraph state definition shared across all agent nodes."""

from typing import TypedDict, Optional, Annotated
from operator import add


class WealthAdvisorState(TypedDict):
    """State object passed through the LangGraph workflow."""
    user_id: str
    year: int
    month: int
    transactions: list[dict]
    categorized_transactions: list[dict]
    budget_goals: list[dict]
    user_profile: dict
    spending_summary: list[dict]
    advisory_plan: Optional[dict]
    messages: Annotated[list[str], add]
    errors: Annotated[list[str], add]
