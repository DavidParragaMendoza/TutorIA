from datetime import datetime

from sqlalchemy import Column, ForeignKey, Index, UniqueConstraint, text
from sqlalchemy.dialects.mysql import BIGINT, DATETIME, VARCHAR
from sqlmodel import Field, SQLModel


class Nivel(SQLModel, table=True):
    __tablename__ = "niveles"
    __table_args__ = (
        UniqueConstraint("codigo", name="uq_niveles_codigo"),
        Index("idx_niveles_creado_por", "creadoPor"),
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
    codigo: str = Field(sa_column=Column(VARCHAR(20), nullable=False))
    descripcion: str | None = Field(default=None, sa_column=Column(VARCHAR(255), nullable=True))
    creadoPor: int | None = Field(
        default=None,
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey("usuarios.id", name="fk_niveles_creado_por", ondelete="RESTRICT", onupdate="RESTRICT"),
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
