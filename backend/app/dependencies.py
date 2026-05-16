"""Shared FastAPI dependencies for auth and Supabase access."""

from fastapi import Depends, HTTPException, Header
from app.services.supabase_client import get_supabase


async def get_current_user(authorization: str = Header(...)):
    """Extract and verify user from Supabase JWT token."""
    token = authorization.replace("Bearer ", "")
    supabase = get_supabase()
    try:
        user = supabase.auth.get_user(token)
        return user.user
    except Exception as e:
        print(f"Auth error: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Invalid or expired token: {str(e)}")


async def get_user_id(user=Depends(get_current_user)) -> str:
    """Extract user ID string from authenticated user."""
    return user.id
