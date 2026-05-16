"""Pydantic schemas for budget goals."""

from pydantic import BaseModel, Field
from typing import Optional


class BudgetGoalCreate(BaseModel):
    """Schema for creating a budget goal."""
    category: str = Field(..., max_length=50)
    monthly_limit: float = Field(..., gt=0)
    priority: str = Field(default="medium", pattern="^(low|medium|high)$")


class BudgetGoalResponse(BaseModel):
    """Schema for budget goal API responses."""
    id: str
    user_id: str
    category: str
    monthly_limit: float
    priority: str
    created_at: str


class BudgetGoalUpdate(BaseModel):
    """Schema for updating a budget goal."""
    monthly_limit: Optional[float] = Field(None, gt=0)
    priority: Optional[str] = Field(None, pattern="^(low|medium|high)$")
