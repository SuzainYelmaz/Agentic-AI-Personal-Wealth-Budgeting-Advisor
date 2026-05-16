"""Supabase client singleton for database and auth operations."""

from supabase import create_client, Client
from app.config import settings

_client: Client | None = None
_service_client: Client | None = None


def get_supabase() -> Client:
    """Return singleton Supabase client using service-role key.
    
    The backend handles authentication independently via JWT verification
    in the get_current_user dependency, so we use the service-role key
    to bypass RLS for server-side database operations.
    """
    global _client
    if _client is None:
        _client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
    return _client


def get_auth_supabase() -> Client:
    """Return Supabase client with anon key for auth operations (signup, login)."""
    global _service_client
    if _service_client is None:
        _service_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    return _service_client
