"""Authentication router using Supabase Auth."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.services.supabase_client import get_auth_supabase

router = APIRouter()


class RegisterRequest(BaseModel):
    """Register request body with optional full name."""
    email: EmailStr
    password: str
    full_name: Optional[str] = ""


class LoginRequest(BaseModel):
    """Login request body."""
    email: EmailStr
    password: str


class ProfileSetup(BaseModel):
    """Optional profile setup after registration."""
    monthly_income: float = 0
    currency: str = "USD"


@router.post("/register")
async def register(body: RegisterRequest):
    """Register a new user via Supabase Auth with optional full name."""
    try:
        result = get_auth_supabase().auth.sign_up({
            "email": body.email,
            "password": body.password,
            "options": {
                "data": {
                    "full_name": body.full_name or ""
                }
            }
        })
        return {"user": {"id": result.user.id, "email": result.user.email}, "session": result.session}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
async def login(body: LoginRequest):
    """Sign in an existing user via Supabase Auth."""
    try:
        result = get_auth_supabase().auth.sign_in_with_password({"email": body.email, "password": body.password})
        return {"user": {"id": result.user.id, "email": result.user.email},
                "access_token": result.session.access_token, "refresh_token": result.session.refresh_token}
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.post("/logout")
async def logout():
    """Sign out the current user."""
    try:
        get_auth_supabase().auth.sign_out()
        return {"message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
