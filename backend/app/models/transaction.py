"""Pydantic schemas for transaction data."""

from pydantic import BaseModel, Field
from datetime import date
from typing import Optional


class TransactionCreate(BaseModel):
    """Schema for creating a new transaction."""
    amount: float = Field(..., gt=0, description="Transaction amount")
    description: str = Field(..., max_length=255)
    merchant: str = Field(..., max_length=100)
    transaction_date: date
    category: Optional[str] = None


class TransactionResponse(BaseModel):
    """Schema for transaction API responses."""
    id: str
    user_id: str
    amount: float
    description: str
    merchant: str
    category: Optional[str]
    transaction_date: date
    created_at: str


class CategorizedTransaction(BaseModel):
    """Schema for LLM-categorized transaction output."""
    transaction_id: str
    category: str = Field(..., description="e.g. Housing, Food, Transport")
    subcategory: str = Field(..., description="e.g. Rent, Groceries, Gas")
    is_essential: bool = Field(..., description="Whether this is a necessity")
