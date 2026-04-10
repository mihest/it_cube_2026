from enum import Enum
import uuid

from sqlalchemy import UUID, String, Boolean, Enum as SQLAlchemyEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models import Base


class RouteBudgetEnum(Enum):
    ECONOMY = "Эконом"
    MEDIUM = "Средний"
    OTHER = "Не важно"

    def __str__(self):
        return self.value


class RouteModel(Base):
    __tablename__ = 'routes'
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    title: Mapped[str]
    shortDescription: Mapped[str]
    fullDescription: Mapped[str]
    duration: Mapped[int]
    company
    transport: Mapped[str]
    budget: Mapped[RouteBudgetEnum] = mapped_column(
        SQLAlchemyEnum(RouteBudgetEnum),
        nullable=False
    )
    volunteer: Mapped[bool]
    petsAllowed: Mapped[bool]
    kidsAllowed: Mapped[bool]
    typeLabel: Mapped[bool]
    place: Mapped[str]
    image: Mapped[str]
    gallery
    tips