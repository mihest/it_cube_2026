from src.dao import BaseDAO
from src.routes.models import RouteModel


class RouteDAO(BaseDAO[RouteModel, None, None]):
    model = RouteModel