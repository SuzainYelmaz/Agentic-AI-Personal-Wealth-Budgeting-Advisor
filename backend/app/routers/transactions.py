"""Transactions router — CRUD operations for user transactions."""

from fastapi import APIRouter, Depends, HTTPException
from app.dependencies import get_user_id
from app.models.transaction import TransactionCreate, TransactionResponse
from app.services.supabase_client import get_supabase

router = APIRouter()


@router.get("/", response_model=list[TransactionResponse])
async def list_transactions(year: int, month: int, user_id: str = Depends(get_user_id)):
    """List all transactions for a given month."""
    from datetime import date
    start = date(year, month, 1).isoformat()
    end = date(year, month + 1, 1).isoformat() if month < 12 else date(year + 1, 1, 1).isoformat()
    result = (get_supabase().table("transactions").select("*")
              .eq("user_id", user_id).gte("transaction_date", start)
              .lt("transaction_date", end).order("transaction_date", desc=True).execute())
    return result.data


@router.post("/", response_model=TransactionResponse)
async def create_transaction(body: TransactionCreate, user_id: str = Depends(get_user_id)):
    """Create a new transaction."""
    data = {**body.model_dump(mode="json"), "user_id": user_id}
    result = get_supabase().table("transactions").insert(data).execute()
    if not result.data:
        raise HTTPException(status_code=400, detail="Failed to create transaction")
    return result.data[0]


@router.delete("/{transaction_id}")
async def delete_transaction(transaction_id: str, user_id: str = Depends(get_user_id)):
    """Delete a transaction by ID."""
    result = (get_supabase().table("transactions")
              .delete().eq("id", transaction_id).eq("user_id", user_id).execute())
    if not result.data:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {"message": "Deleted successfully"}
