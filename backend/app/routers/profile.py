"""User profile router — view and update financial profile."""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.dependencies import get_user_id
from app.services.supabase_client import get_supabase

router = APIRouter()


class ProfileUpdate(BaseModel):
    """Schema for updating user profile."""
    full_name: Optional[str] = None
    monthly_income: Optional[float] = None
    currency: Optional[str] = None
    financial_goals: Optional[str] = None
    risk_tolerance: Optional[str] = None
    onboarding_complete: Optional[bool] = None


@router.get("/")
async def get_profile(user_id: str = Depends(get_user_id)):
    """Fetch the authenticated user's profile."""
    result = (get_supabase().table("user_profiles")
              .select("*").eq("user_id", user_id).single().execute())
    if not result.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return result.data


@router.patch("/")
async def update_profile(body: ProfileUpdate, user_id: str = Depends(get_user_id)):
    """Update the authenticated user's profile."""
    updates = body.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = (get_supabase().table("user_profiles")
              .update(updates).eq("user_id", user_id).execute())
    if not result.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return result.data[0]
