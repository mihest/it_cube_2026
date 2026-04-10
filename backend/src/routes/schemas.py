from typing import Optional

from pydantic import BaseModel

from src.routes.models import RouteBudgetEnum


class RouteFilter(BaseModel):
    search: Optional[str] = None
    company: Optional[str] = None
    transport: Optional[str] = None
    budget: Optional[RouteBudgetEnum] = None
    withPets: Optional[bool] = None
    volunteerOnly: Optional[bool] = None
    interests: Optional[str] = None