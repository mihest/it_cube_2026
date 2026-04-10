from enum import Enum
import uuid

from sqlalchemy import UUID, String, Boolean, Enum as SQLAlchemyEnum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models import Base


class RouteBudgetEnum(Enum):
    ECONOMY = "Эконом"
    MEDIUM = "Средний"
    OTHER = "Не важно"

    def __str__(self):
        return self.value


class CompanyModel(Base):
    __tablename__ = "companies"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String, nullable=False)


class RouteCompanyModel(Base):
    __tablename__ = "route_company"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    route_id: Mapped[uuid.UUID] = mapped_column(UUID, ForeignKey(
        "routes.id", ondelete="CASCADE"
    ))
    company_id: Mapped[uuid.UUID] = mapped_column(UUID, ForeignKey(
        "companies.id", ondelete="CASCADE"
    ))



class InterestModel(Base):
    __tablename__ = "interests"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String, nullable=False)


class RouteInterestModel(Base):
    __tablename__ = "route_interests"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    route_id: Mapped[uuid.UUID] = mapped_column(UUID, ForeignKey(
        "routes.id", ondelete="CASCADE"
    ))
    interest_id: Mapped[uuid.UUID] = mapped_column(UUID, ForeignKey(
        "interests.id", ondelete="CASCADE"
    ))


class RouteGalleryModel(Base):
    __tablename__ = "route_gallery"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    route_id: Mapped[uuid.UUID] = mapped_column(UUID, ForeignKey(
        "routes.id", ondelete="CASCADE"
    ))
    image: Mapped[str] = mapped_column(String, nullable=False)


class RouteTipModel(Base):
    __tablename__ = "route_tips"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    route_id: Mapped[uuid.UUID] = mapped_column(UUID, ForeignKey(
        "routes.id", ondelete="CASCADE"
    ))
    tip: Mapped[str] = mapped_column(String, nullable=False)



class RouteModel(Base):
    __tablename__ = 'routes'
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    title: Mapped[str]
    shortDescription:  Mapped[str]
    fullDescription: Mapped[str]
    duration: Mapped[int]
    transport: Mapped[str]
    budget: Mapped[RouteBudgetEnum]
    volunteer: Mapped[bool]
    volunteerImpact: Mapped[str]
    petsAllowed: Mapped[bool]
    kidsAllowed: Mapped[bool]
    typeLabel: Mapped[str]
    place: Mapped[str]
    priceFrom: Mapped[float]
    bookingDates: Mapped[str]
    image: Mapped[str]
    coordinates_latitude: Mapped[float]
    coordinates_longitude: Mapped[float]