from datetime import datetime

from sqlalchemy import Column, ForeignKey, Index, UniqueConstraint, text
from sqlalchemy.dialects.mysql import BIGINT, DATETIME, VARCHAR
from sqlmodel import Field, SQLModel


class Idioma(SQLModel, table=True):
    __tablename__ = "idiomas"
    __table_args__ = (
        UniqueConstraint("nombre", name="uq_idiomas_nombre"),
        Index("idx_idiomas_creado_por", "creadoPor"),
        {
            "mysql_engine": "InnoDB",
            "mysql_charset": "utf8mb4",
            "mysql_collate": "utf8mb4_unicode_ci",
        },
    )

    id: int | None = Field(
        default=None,
        sa_column=Column(BIGINT(unsigned=True), primary_key=True, autoincrement=True, nullable=False),
    )
    nombre: str = Field(sa_column=Column(VARCHAR(50), nullable=False))
    creadoPor: int | None = Field(
        default=None,
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey("usuarios.id", name="fk_idiomas_creado_por", ondelete="RESTRICT", onupdate="RESTRICT"),
            nullable=True,
        ),
    )
    fechaCreacion: datetime | None = Field(
        default=None,
        sa_column=Column(
            DATETIME(fsp=6),
            nullable=False,
            server_default=text("CURRENT_TIMESTAMP(6)"),
        ),
    )
