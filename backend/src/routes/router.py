from typing import Annotated

from fastapi import APIRouter, Query

from src.database import SessionDep
from src.routes.schemas import RouteFilter
from src.routes.service import RouteService

router = APIRouter()

@router.get("")
async def get_routes(
    session: SessionDep,
    filters: Annotated[RouteFilter, Query()]
):
    return await RouteService.get_list_routes(session, filters)