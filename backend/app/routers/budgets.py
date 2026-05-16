"""Budget goals router — CRUD operations for user budget goals."""

from fastapi import APIRouter, Depends, HTTPException
from app.dependencies import get_user_id
from app.models.budget import BudgetGoalCreate, BudgetGoalResponse, BudgetGoalUpdate
from app.services.supabase_client import get_supabase

router = APIRouter()


@router.get("/", response_model=list[BudgetGoalResponse])
async def list_goals(user_id: str = Depends(get_user_id)):
    """List all budget goals for the authenticated user."""
    result = (get_supabase().table("budget_goals")
              .select("*").eq("user_id", user_id).execute())
    return result.data


@router.post("/", response_model=BudgetGoalResponse)
async def create_goal(body: BudgetGoalCreate, user_id: str = Depends(get_user_id)):
    """Create a new budget goal."""
    data = {**body.model_dump(), "user_id": user_id}
    result = get_supabase().table("budget_goals").insert(data).execute()
    if not result.data:
        raise HTTPException(status_code=400, detail="Failed to create goal")
    return result.data[0]


@router.patch("/{goal_id}", response_model=BudgetGoalResponse)
async def update_goal(goal_id: str, body: BudgetGoalUpdate, user_id: str = Depends(get_user_id)):
    """Update an existing budget goal."""
    updates = body.model_dump(exclude_none=True)
    result = (get_supabase().table("budget_goals")
              .update(updates).eq("id", goal_id).eq("user_id", user_id).execute())
    if not result.data:
        raise HTTPException(status_code=404, detail="Goal not found")
    return result.data[0]


@router.delete("/{goal_id}")
async def delete_goal(goal_id: str, user_id: str = Depends(get_user_id)):
    """Delete a budget goal by ID."""
    result = (get_supabase().table("budget_goals")
              .delete().eq("id", goal_id).eq("user_id", user_id).execute())
    if not result.data:
        raise HTTPException(status_code=404, detail="Goal not found")
    return {"message": "Deleted successfully"}
