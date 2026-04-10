from datetime import datetime
from enum import Enum
import uuid

from sqlalchemy import UUID, String, Boolean, Enum as SQLAlchemyEnum, ForeignKey, TIMESTAMP, func, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models import Base
from src.routes.models import RouteModel


class CommentModel(Base):
    __tablename__ = 'comments'
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey(
        "users.id", ondelete="CASCADE", onupdate="CASCADE"
    ), nullable=False)
    route_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey(
        "routes.id", ondelete="CASCADE", onupdate="CASCADE"
    ), nullable=False)
    rating: Mapped[int] = mapped_column(Integer, nullable=False)
    text: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())

    route: Mapped[RouteModel] =  relationship(
        "RouteModel",
        backref="comments",
    )

