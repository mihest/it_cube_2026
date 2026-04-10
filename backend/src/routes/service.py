from src.routes.dao import RouteDAO
from src.routes.models import RouteModel
from src.routes.schemas import RouteFilter
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import or_


class RouteService:
    @classmethod
    async def get_list_routes(cls, session: AsyncSession, filters: RouteFilter):
        conditions = []

        if filters.search:
            search_value = f"%{filters.search.strip()}%"
            conditions.append(
                or_(
                    RouteModel.title.ilike(search_value),
                    RouteModel.fullDescription.ilike(search_value),
                    RouteModel.shortDescription.ilike(search_value),
                )
            )

        if filters.company:
            conditions.append(RouteModel.company.ilike(f"%{filters.company.strip()}%"))

        if filters.transport:
            conditions.append(RouteModel.transport == filters.transport)

        if filters.budget is not None:
            conditions.append(RouteModel.budget == filters.budget)

        if filters.withPets is not None:
            conditions.append(RouteModel.petsAllowed == filters.withPets)

        if filters.volunteerOnly is not None:
            conditions.append(RouteModel.volunteer == filters.volunteerOnly)

        if filters.interests:
            conditions.append(RouteModel.interests.ilike(f"%{filters.interests.strip()}%"))
        return await RouteDAO.find_all(session,  *conditions)
