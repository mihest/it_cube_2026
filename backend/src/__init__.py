from fastapi import APIRouter

from .auth.router import router as auth_router
from .accounts.router import router as accounts_router
from .routes.router import router as routes_router

all_routers = APIRouter()

all_routers.include_router(
    auth_router,
    prefix='/auth',
    tags=['Authentication']
)

all_routers.include_router(
    accounts_router,
    prefix='/accounts'
)

all_routers.include_router(
    routes_router,
    prefix='/routes'
)