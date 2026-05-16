"""Pydantic schemas for advisory plan output."""

from pydantic import BaseModel, Field
from typing import List


class AdvisoryStep(BaseModel):
    """Single actionable step in the advisory plan."""
    step_number: int
    title: str
    description: str
    impact: str = Field(..., description="Expected financial impact")
    difficulty: str = Field(..., pattern="^(easy|medium|hard)$")


class SpendingSummary(BaseModel):
    """Aggregated spending summary by category."""
    category: str
    total_spent: float
    budget_limit: float
    percentage_used: float
    status: str = Field(..., description="under_budget | on_track | over_budget")


class AdvisoryPlan(BaseModel):
    """Complete financial advisory plan from AdvisorAgent."""
    summary: str = Field(..., description="Executive summary of finances")
    total_income: float
    total_spent: float
    savings_rate: float
    spending_breakdown: List[SpendingSummary]
    action_steps: List[AdvisoryStep]
    risk_alerts: List[str]
    month: str
