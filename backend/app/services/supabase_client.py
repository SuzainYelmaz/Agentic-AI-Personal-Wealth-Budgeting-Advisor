"""Supabase client singleton for database and auth operations."""

from supabase import create_client, Client
from app.config import settings

_client: Client | None = None


def get_supabase() -> Client:
    """Return singleton Supabase client instance."""
    global _client
    if _client is None:
        _client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    return _client


def get_service_supabase() -> Client:
    """Return Supabase client with service-role key for admin ops."""
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
