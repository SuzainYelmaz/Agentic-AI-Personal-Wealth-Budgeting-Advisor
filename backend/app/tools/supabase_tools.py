"""Supabase database tools for LangGraph agents to interact with data."""

from datetime import date, timedelta
from langchain_core.tools import tool
from app.services.supabase_client import get_supabase


@tool
def fetch_monthly_transactions(user_id: str, year: int, month: int) -> list[dict]:
    """Fetch all transactions for a user in a given month from Supabase."""
    start = date(year, month, 1)
    end = date(year, month + 1, 1) if month < 12 else date(year + 1, 1, 1)
    result = (get_supabase().table("transactions")
              .select("*").eq("user_id", user_id)
              .gte("transaction_date", start.isoformat())
              .lt("transaction_date", end.isoformat())
              .execute())
    return result.data


@tool
def fetch_budget_goals(user_id: str) -> list[dict]:
    """Fetch all budget goals for a user from Supabase."""
    result = (get_supabase().table("budget_goals")
              .select("*").eq("user_id", user_id).execute())
    return result.data


@tool
def update_transaction_category(transaction_id: str, category: str, subcategory: str, is_essential: bool) -> dict:
    """Update a transaction's category fields in Supabase."""
    result = (get_supabase().table("transactions")
              .update({"category": category, "subcategory": subcategory, "is_essential": is_essential})
              .eq("id", transaction_id).execute())
    return result.data[0] if result.data else {}


@tool
def save_advisory_report(user_id: str, month: str, report: dict) -> dict:
    """Save a generated advisory report to Supabase."""
    result = (get_supabase().table("advisory_reports")
              .upsert({"user_id": user_id, "month": month, "report": report})
              .execute())
    return result.data[0] if result.data else {}


@tool
def fetch_user_profile(user_id: str) -> dict:
    """Fetch the user's financial profile from Supabase."""
    result = (get_supabase().table("user_profiles")
              .select("*").eq("user_id", user_id)
              .single().execute())
    return result.data or {}
